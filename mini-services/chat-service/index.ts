import { createServer, IncomingMessage } from "http";
import { Server, Socket } from "socket.io";

// ============================================================
// Khidma Real-time Messaging Service
// ============================================================
// Lightweight socket.io service for the Khidma freelance marketplace.
// Supports: 1-to-1 conversations, typing indicators, read receipts,
// presence (online/offline), and a built-in demo bot that replies
// so a single user can experience the conversation flow.
// ============================================================

interface User {
  id: string; // Khidma user id (e.g. "demo-user-1")
  name: string;
  avatar?: string;
  role: "freelancer" | "client";
}

interface ConversationMessage {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
  read: boolean;
}

interface Conversation {
  id: string;
  participantIds: string[]; // [userA, userB]
  lastMessage?: ConversationMessage;
  updatedAt: string;
}

// ---- in-memory stores (resets on restart; production would use Redis/DB) ----
const users = new Map<string, User>(); // userId -> User
const sockets = new Map<string, Set<string>>(); // userId -> Set<socketId>
const conversations = new Map<string, Conversation>(); // conversationId -> Conversation
const messagesByConversation = new Map<string, ConversationMessage[]>(); // conversationId -> messages[]
const typingByConversation = new Map<string, Map<string, number>>(); // conversationId -> (userId -> timestamp)

// ---- helpers ----
const genId = () => Math.random().toString(36).slice(2, 11);

const conversationIdFor = (a: string, b: string) =>
  [a, b].sort().join("__");

const seedDemoData = () => {
  const bot: User = {
    id: "bot-amira",
    name: "Amira Ben Salah",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amira%20Ben%20Salah&backgroundColor=2b3d3d&radius=50",
    role: "freelancer",
  };
  users.set(bot.id, bot);

  // Pre-seed a welcome conversation with the bot for any new connecting user.
  // (Created on-demand when the user connects.)
};

seedDemoData();

const BOT_REPLIES = [
  "Hi! Thanks for reaching out. I'd love to hear more about your project. 🙌",
  "Sounds great! I have availability next week — shall we set up a call?",
  "My typical turnaround for this kind of project is 5–7 business days.",
  "I can deliver that within your budget. Want me to send a proposal?",
  "Just to confirm: you're looking for a Next.js landing page with GSAP animations, right?",
  "Perfect. I'll prepare a detailed proposal including timeline and milestones.",
  "Great question — yes, I include 2 rounds of revisions in the standard package.",
  "I've worked with 3 Tunisian fintech startups before, so I know the regulatory context well.",
  "Let me know if you'd prefer to communicate in French or Arabic — I'm comfortable in all three.",
];

const pickBotReply = () =>
  BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)] ?? BOT_REPLIES[0];

const sendConversationList = (io: Server, userId: string) => {
  const userConvs: Conversation[] = [];
  for (const c of conversations.values()) {
    if (c.participantIds.includes(userId)) userConvs.push(c);
  }
  userConvs.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  io.to(`user:${userId}`).emit("conversations:list", { conversations: userConvs });
};

const ensureWelcomeConversation = (io: Server, userId: string, user: User) => {
  const botId = "bot-amira";
  if (botId === userId) return;
  const cid = conversationIdFor(userId, botId);
  if (!conversations.has(cid)) {
    const welcome: ConversationMessage = {
      id: genId(),
      conversationId: cid,
      senderId: botId,
      text:
        "Hi! I'm Amira 👋 Thanks for visiting my profile. Tell me about your project and I'll respond as soon as I can.",
      createdAt: new Date().toISOString(),
      read: false,
    };
    conversations.set(cid, {
      id: cid,
      participantIds: [userId, botId],
      lastMessage: welcome,
      updatedAt: welcome.createdAt,
    });
    messagesByConversation.set(cid, [welcome]);
  }
  sendConversationList(io, userId);
};

const httpServer = createServer((req: IncomingMessage, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ service: "khidma-chat", status: "ok", uptime: process.uptime() }));
});

const io = new Server(httpServer, {
  path: "/",
  cors: { origin: "*", methods: ["GET", "POST"] },
  pingTimeout: 60000,
  pingInterval: 25000,
});

io.on("connection", (socket: Socket) => {
  let currentUserId: string | null = null;

  socket.on("auth", (payload: { userId: string; name: string; avatar?: string; role: "freelancer" | "client" }) => {
    currentUserId = payload.userId;
    const user: User = {
      id: payload.userId,
      name: payload.name,
      avatar: payload.avatar,
      role: payload.role,
    };
    users.set(payload.userId, user);

    if (!sockets.has(payload.userId)) sockets.set(payload.userId, new Set());
    sockets.get(payload.userId)!.add(socket.id);

    socket.join(`user:${payload.userId}`);
    ensureWelcomeConversation(io, payload.userId, user);

    // Broadcast presence to friends (anyone sharing a conversation with this user)
    const friends = new Set<string>();
    for (const c of conversations.values()) {
      if (c.participantIds.includes(payload.userId)) {
        for (const pid of c.participantIds) if (pid !== payload.userId) friends.add(pid);
      }
    }
    for (const f of friends) {
      io.to(`user:${f}`).emit("presence:update", { userId: payload.userId, online: true });
    }

    console.log(`[chat] ${user.name} (${payload.userId}) connected`);
  });

  socket.on("conversations:fetch", () => {
    if (currentUserId) sendConversationList(io, currentUserId);
  });

  socket.on("messages:fetch", ({ conversationId }: { conversationId: string }) => {
    if (!currentUserId) return;
    const msgs = messagesByConversation.get(conversationId) ?? [];
    // Mark as read for the current user
    const updated = msgs.map((m) => (m.senderId === currentUserId ? m : { ...m, read: true }));
    messagesByConversation.set(conversationId, updated);
    socket.emit("messages:list", { conversationId, messages: updated });
    sendConversationList(io, currentUserId); // refresh unread count
  });

  socket.on("message:send", ({ conversationId, text }: { conversationId: string; text: string }) => {
    if (!currentUserId || !text.trim()) return;
    const conv = conversations.get(conversationId);
    if (!conv || !conv.participantIds.includes(currentUserId)) return;

    const msg: ConversationMessage = {
      id: genId(),
      conversationId,
      senderId: currentUserId,
      text: text.trim(),
      createdAt: new Date().toISOString(),
      read: false,
    };
    const list = messagesByConversation.get(conversationId) ?? [];
    list.push(msg);
    messagesByConversation.set(conversationId, list);
    conv.lastMessage = msg;
    conv.updatedAt = msg.createdAt;

    // Emit to all participants
    for (const pid of conv.participantIds) {
      io.to(`user:${pid}`).emit("message:received", { conversationId, message: msg });
    }
    sendConversationList(io, currentUserId);

    // If the other participant is the bot, auto-reply after a short delay
    const otherId = conv.participantIds.find((p) => p !== currentUserId);
    if (otherId === "bot-amira") {
      setTimeout(() => {
        const botMsg: ConversationMessage = {
          id: genId(),
          conversationId,
          senderId: "bot-amira",
          text: pickBotReply(),
          createdAt: new Date().toISOString(),
          read: false,
        };
        const list2 = messagesByConversation.get(conversationId) ?? [];
        list2.push(botMsg);
        messagesByConversation.set(conversationId, list2);
        conv.lastMessage = botMsg;
        conv.updatedAt = botMsg.createdAt;
        for (const pid of conv.participantIds) {
          io.to(`user:${pid}`).emit("message:received", { conversationId, message: botMsg });
        }
        sendConversationList(io, currentUserId);
      }, 1400 + Math.random() * 1200);
    }
  });

  socket.on("typing:start", ({ conversationId }: { conversationId: string }) => {
    if (!currentUserId) return;
    const conv = conversations.get(conversationId);
    if (!conv) return;
    if (!typingByConversation.has(conversationId))
      typingByConversation.set(conversationId, new Map());
    typingByConversation.get(conversationId)!.set(currentUserId, Date.now());
    for (const pid of conv.participantIds) {
      if (pid !== currentUserId) io.to(`user:${pid}`).emit("typing:update", { conversationId, userId: currentUserId, typing: true });
    }
  });

  socket.on("typing:stop", ({ conversationId }: { conversationId: string }) => {
    if (!currentUserId) return;
    const conv = conversations.get(conversationId);
    if (!conv) return;
    typingByConversation.get(conversationId)?.delete(currentUserId);
    for (const pid of conv.participantIds) {
      if (pid !== currentUserId) io.to(`user:${pid}`).emit("typing:update", { conversationId, userId: currentUserId, typing: false });
    }
  });

  socket.on("conversation:start", ({ otherUserId }: { otherUserId: string }) => {
    if (!currentUserId || !users.has(otherUserId) || otherUserId === currentUserId) return;
    const cid = conversationIdFor(currentUserId, otherUserId);
    if (!conversations.has(cid)) {
      conversations.set(cid, {
        id: cid,
        participantIds: [currentUserId, otherUserId],
        updatedAt: new Date().toISOString(),
      });
      messagesByConversation.set(cid, []);
    }
    sendConversationList(io, currentUserId);
    socket.emit("conversation:ready", { conversationId: cid, otherUserId });
  });

  socket.on("disconnect", () => {
    if (!currentUserId) return;
    const sockset = sockets.get(currentUserId);
    if (sockset) {
      sockset.delete(socket.id);
      if (sockset.size === 0) {
        sockets.delete(currentUserId);
        // Broadcast offline
        const friends = new Set<string>();
        for (const c of conversations.values()) {
          if (c.participantIds.includes(currentUserId)) {
            for (const pid of c.participantIds) if (pid !== currentUserId) friends.add(pid);
          }
        }
        for (const f of friends) io.to(`user:${f}`).emit("presence:update", { userId: currentUserId, online: false });
        console.log(`[chat] ${users.get(currentUserId)?.name} (${currentUserId}) disconnected`);
      }
    }
  });
});

const PORT = 3003;
httpServer.listen(PORT, () => {
  console.log(`[chat] Khidma messaging service listening on :${PORT}`);
});

process.on("SIGTERM", () => httpServer.close(() => process.exit(0)));
process.on("SIGINT", () => httpServer.close(() => process.exit(0)));
