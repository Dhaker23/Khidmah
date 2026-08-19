"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { io, type Socket } from "socket.io-client";
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageSquare,
  Send,
  Paperclip,
  Smile,
  Search,
  PenSquare,
  X,
  ArrowLeft,
  CheckCheck,
  Check,
  Loader2,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { toast } from "sonner";
import { KhidmaLogo } from "@/components/khidma/logo";
import { cn } from "@/lib/utils";

// ---- types ----
interface ServerUser {
  id: string;
  name: string;
  avatar?: string;
  role: "freelancer" | "client";
}

interface ServerMessage {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
  read: boolean;
}

interface ServerConversation {
  id: string;
  participantIds: string[];
  lastMessage?: ServerMessage;
  updatedAt: string;
}

// ---- helpers ----
const timeAgo = (iso: string): string => {
  const d = new Date(iso).getTime();
  const diff = Math.max(0, Date.now() - d);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const days = Math.floor(h / 24);
  if (days < 7) return `${days}d`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const clockTime = (iso: string): string =>
  new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

const truncate = (s: string, n = 32) =>
  s.length > n ? `${s.slice(0, n - 1)}…` : s;

// Mock list of "discoverable" users (for the new-chat dropdown). The server only
// pre-seeds the bot, so we render a curated list of Khidma freelancers that the
// user can start a conversation with — all of them route to the demo bot for
// the purpose of this demo.
const DISCOVERABLE_USERS: ServerUser[] = [
  {
    id: "bot-amira",
    name: "Amira Ben Salah",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Amira%20Ben%20Salah&backgroundColor=2b3d3d&radius=50",
    role: "freelancer",
  },
];

export function MessagingModal() {
  const {
    modal: { messagingOpen },
    closeMessaging,
    openAuth,
    currentUser,
  } = useApp();

  const [socketReady, setSocketReady] = useState(false);
  const [conversations, setConversations] = useState<ServerConversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ServerMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [typingUserIds, setTypingUserIds] = useState<Set<string>>(new Set());
  const [presence, setPresence] = useState<Record<string, boolean>>({});
  const [showDiscover, setShowDiscover] = useState(false);
  const [search, setSearch] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [lastOpen, setLastOpen] = useState(messagingOpen);
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(selectedId);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const typingStopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectedIdRef = useRef<string | null>(selectedId);
  const socketRef = useRef<Socket | null>(null);

  // Compose a stable, unique userId for the current user.
  const currentUserId = useMemo(() => {
    if (!currentUser) return null;
    return `${currentUser.name}::client`;
  }, [currentUser]);

  // Keep the ref in sync with the latest selectedId so socket event handlers
  // (which capture the ref once at setup time) always read the current value.
  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  // React 19 render-time adjustment: when the modal transitions from
  // open→closed, reset all transient state. This avoids setState-in-effect
  // cascades that the lint rule disallows.
  if (messagingOpen !== lastOpen) {
    setLastOpen(messagingOpen);
    if (!messagingOpen) {
      setMessages([]);
      setSelectedId(null);
      setDraft("");
      setTypingUserIds(new Set());
      setSearch("");
      setShowDiscover(false);
      setConnecting(false);
      setSocketReady(false);
    } else if (currentUser) {
      setConnecting(true);
    }
  }

  // When selectedId changes (different conversation picked), clear the local
  // messages so the previous conversation's messages don't briefly bleed in.
  if (selectedId !== lastSelectedId) {
    setLastSelectedId(selectedId);
    setMessages([]);
    setTypingUserIds(new Set());
  }

  // Lock body scroll while open.
  useEffect(() => {
    if (!messagingOpen) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = orig;
    };
  }, [messagingOpen]);

  // Connect to the chat mini-service on port 3003 once a user is available.
  useEffect(() => {
    if (!messagingOpen || !currentUser || !currentUserId) return;
    const sock = io("/?XTransformPort=3003", {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 3,
      timeout: 8000,
    });
    socketRef.current = sock;

    sock.on("connect", () => {
      sock.emit("auth", {
        userId: currentUserId,
        name: currentUser.name,
        avatar: currentUser.avatar,
        role: currentUser.type,
      });
      sock.emit("conversations:fetch");
      setConnecting(false);
      setSocketReady(true);
    });

    sock.on("connect_error", () => {
      setConnecting(false);
      setSocketReady(false);
      toast.error("Chat service unavailable", {
        description: "Please try again in a moment.",
      });
    });

    sock.on("conversations:list", (payload: { conversations: ServerConversation[] }) => {
      setConversations(payload.conversations ?? []);
    });

    sock.on(
      "messages:list",
      (payload: { conversationId: string; messages: ServerMessage[] }) => {
        if (payload.conversationId === selectedIdRef.current) {
          setMessages(payload.messages ?? []);
        }
      }
    );

    sock.on(
      "message:received",
      (payload: { conversationId: string; message: ServerMessage }) => {
        if (payload.conversationId === selectedIdRef.current) {
          setMessages((prev) =>
            prev.some((m) => m.id === payload.message.id)
              ? prev
              : [...prev, payload.message]
          );
        }
      }
    );

    sock.on(
      "typing:update",
      (payload: { conversationId: string; userId: string; typing: boolean }) => {
        if (payload.conversationId !== selectedIdRef.current) return;
        setTypingUserIds((prev) => {
          const next = new Set(prev);
          if (payload.typing) next.add(payload.userId);
          else next.delete(payload.userId);
          return next;
        });
      }
    );

    sock.on(
      "presence:update",
      (payload: { userId: string; online: boolean }) => {
        setPresence((prev) => ({ ...prev, [payload.userId]: payload.online }));
      }
    );

    sock.on("conversation:ready", (payload: { conversationId: string }) => {
      setSelectedId(payload.conversationId);
      setShowDiscover(false);
      sock.emit("messages:fetch", { conversationId: payload.conversationId });
    });

    return () => {
      sock.removeAllListeners();
      sock.disconnect();
      socketRef.current = null;
      setSocketReady(false);
    };
  }, [messagingOpen, currentUser, currentUserId]);

  // Re-fetch messages when selection changes (side-effect only — no setState).
  useEffect(() => {
    if (!socketRef.current || !selectedId) return;
    socketRef.current.emit("messages:fetch", { conversationId: selectedId });
  }, [socketReady, selectedId]);

  // Auto-scroll to latest message.
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, typingUserIds]);

  // Auto-grow the textarea.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 144)}px`;
  }, [draft]);

  if (!messagingOpen) return null;

  // ---- login wall ----
  if (!currentUser) {
    return (
      <Dialog open onOpenChange={(o) => !o && closeMessaging()}>
        <DialogPortal>
          <DialogOverlay className="bg-[#192d2f]/70 backdrop-blur-sm" />
          <DialogContent
            className="max-w-md gap-0 p-0 overflow-hidden"
            aria-describedby={undefined}
            showCloseButton
          >
            <DialogTitle className="sr-only">Messages</DialogTitle>
            <DialogDescription className="sr-only">
              Log in to start a conversation.
            </DialogDescription>
            <div className="bg-khidma-gradient text-white px-6 py-8 text-center">
              <div className="mx-auto size-14 rounded-full bg-white/10 flex items-center justify-center mb-3">
                <MessageSquare className="size-6 text-white" />
              </div>
              <h2 className="text-lg font-semibold">Log in to chat</h2>
              <p className="text-xs text-white/70 mt-1">
                Connect with verified freelancers and clients in real time.
              </p>
            </div>
            <div className="p-6 flex flex-col gap-3">
              <Button
                className="bg-[#2b3d3d] hover:bg-[#192d2f] text-white h-11"
                onClick={() => {
                  closeMessaging();
                  openAuth("login");
                }}
              >
                <MessageSquare className="size-4" /> Log in to Khidma
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  closeMessaging();
                  openAuth("register");
                }}
              >
                Create an account
              </Button>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    );
  }

  // ---- resolve other participant for a conversation ----
  const resolveOther = (c: ServerConversation): ServerUser | null => {
    const otherId = c.participantIds.find((p) => p !== currentUserId);
    if (!otherId) return null;
    // The server pre-seeds the demo bot (bot-amira). We also keep a small static
    // map of "discoverable" Khidma users so the sidebar can render names even
    // before the server emits user profiles (which it currently doesn't).
    if (otherId === "bot-amira") return DISCOVERABLE_USERS[0];
    // For demo-only users seeded client-side, fall back to a friendly name.
    if (otherId.includes("::")) {
      const [name] = otherId.split("::");
      return {
        id: otherId,
        name,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
          name
        )}&backgroundColor=32504d&radius=50`,
        role: "freelancer",
      };
    }
    return {
      id: otherId,
      name: "Khidma User",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherId}&backgroundColor=6e8580&radius=50`,
      role: "freelancer",
    };
  };

  const selectedConv =
    conversations.find((c) => c.id === selectedId) ?? null;
  const other = selectedConv ? resolveOther(selectedConv) : null;
  const isOtherTyping = other ? typingUserIds.has(other.id) : false;
  const isOtherOnline = other ? presence[other.id] === true : false;

  const handleSend = () => {
    const text = draft.trim();
    if (!text || !socketRef.current || !selectedId) return;
    socketRef.current.emit("message:send", { conversationId: selectedId, text });
    setDraft("");
    socketRef.current.emit("typing:stop", { conversationId: selectedId });
    if (typingStopTimer.current) {
      clearTimeout(typingStopTimer.current);
      typingStopTimer.current = null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraft(e.target.value);
    if (!socketRef.current || !selectedId) return;
    socketRef.current.emit("typing:start", { conversationId: selectedId });
    if (typingStopTimer.current) clearTimeout(typingStopTimer.current);
    typingStopTimer.current = setTimeout(() => {
      socketRef.current?.emit("typing:stop", { conversationId: selectedId });
    }, 2000);
  };

  const handleSelectConversation = (c: ServerConversation) => {
    setSelectedId(c.id);
  };

  const handleStartWithUser = (u: ServerUser) => {
    if (!socketRef.current || !currentUserId) return;
    socketRef.current.emit("conversation:start", { otherUserId: u.id });
  };

  const filteredConversations = conversations.filter((c) => {
    if (!search.trim()) return true;
    const o = resolveOther(c);
    const name = o?.name ?? "";
    const last = c.lastMessage?.text ?? "";
    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      last.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <Dialog open onOpenChange={(o) => !o && closeMessaging()}>
      <DialogPortal>
        <DialogOverlay className="bg-[#192d2f]/70 backdrop-blur-sm" />
        <DialogContent
          className="max-w-4xl w-[calc(100%-1.5rem)] h-[80vh] max-h-[80vh] p-0 gap-0 overflow-hidden"
          aria-describedby={undefined}
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">Khidma Messages</DialogTitle>
          <DialogDescription className="sr-only">
            Real-time chat with your Khidma contacts.
          </DialogDescription>

          <div className="flex h-full">
            {/* LEFT — conversation list */}
            <aside
              className={cn(
                "w-full md:w-[280px] shrink-0 border-r border-border/60 flex flex-col bg-card/60",
                selectedId && "hidden md:flex"
              )}
            >
              <div className="px-4 pt-4 pb-3 border-b border-border/60 bg-khidma-gradient text-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <KhidmaLogo variant="symbol" size="sm" />
                    <h2 className="text-base font-semibold">Messages</h2>
                  </div>
                  <button
                    aria-label="New chat"
                    className="size-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    onClick={() => setShowDiscover((s) => !s)}
                  >
                    <PenSquare className="size-4 text-white" />
                  </button>
                </div>
                <div className="relative">
                  <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-white/60" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search messages…"
                    className="w-full h-8 pl-8 pr-2 rounded-md bg-white/10 text-xs text-white placeholder:text-white/50 outline-none focus:ring-1 focus:ring-white/30"
                  />
                </div>
              </div>

              {/* Discover users panel (new chat) */}
              <AnimatePresence>
                {showDiscover && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-b border-border/60 bg-[#32504d]/5"
                  >
                    <div className="p-3">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 px-1">
                        Start a new chat
                      </p>
                      <ul className="space-y-1">
                        {DISCOVERABLE_USERS.map((u) => (
                          <li key={u.id}>
                            <button
                              onClick={() => handleStartWithUser(u)}
                              className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#32504d]/10 transition-colors text-left"
                            >
                              <Avatar className="size-9 rounded-full">
                                <AvatarImage src={u.avatar} alt={u.name} />
                                <AvatarFallback className="bg-[#32504d]/30 text-[#32504d] text-xs font-semibold">
                                  {u.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold truncate">
                                  {u.name}
                                </p>
                                <p className="text-[10px] text-muted-foreground capitalize">
                                  {u.role}
                                </p>
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <ScrollArea className="flex-1">
                <ul className="py-1">
                  {connecting && conversations.length === 0 && (
                    <li className="px-4 py-8 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
                      <Loader2 className="size-4 animate-spin text-[#32504d]" />
                      Connecting to chat…
                    </li>
                  )}
                  {!connecting && filteredConversations.length === 0 && (
                    <li className="px-4 py-10 text-center">
                      <MessageCircle className="size-7 mx-auto text-muted-foreground/40 mb-2" />
                      <p className="text-xs text-muted-foreground">
                        No conversations yet.
                      </p>
                      <button
                        onClick={() => setShowDiscover(true)}
                        className="text-[11px] text-[#32504d] hover:underline mt-1"
                      >
                        Start a new chat →
                      </button>
                    </li>
                  )}
                  {filteredConversations.map((c) => {
                    const o = resolveOther(c);
                    if (!o) return null;
                    const last = c.lastMessage;
                    const unread =
                      last && !last.read && last.senderId !== currentUserId;
                    const isActive = c.id === selectedId;
                    return (
                      <li key={c.id}>
                        <button
                          onClick={() => handleSelectConversation(c)}
                          className={cn(
                            "w-full px-3 py-2.5 flex items-start gap-2.5 text-left transition-colors border-l-2",
                            isActive
                              ? "bg-[#32504d]/10 border-[#32504d]"
                              : "border-transparent hover:bg-muted/60"
                          )}
                        >
                          <div className="relative">
                            <Avatar className="size-10 rounded-full">
                              <AvatarImage src={o.avatar} alt={o.name} />
                              <AvatarFallback className="bg-[#32504d]/30 text-[#32504d] text-xs font-semibold">
                                {o.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            {presence[o.id] && (
                              <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-500 ring-2 ring-card" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs font-semibold truncate">
                                {o.name}
                              </p>
                              {last && (
                                <span className="text-[10px] text-muted-foreground shrink-0">
                                  {timeAgo(last.createdAt)}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-between gap-2 mt-0.5">
                              <p
                                className={cn(
                                  "text-[11px] truncate",
                                  unread ? "text-foreground font-medium" : "text-muted-foreground"
                                )}
                              >
                                {last
                                  ? `${last.senderId === currentUserId ? "You: " : ""}${truncate(last.text, 28)}`
                                  : "No messages yet"}
                              </p>
                              {unread && (
                                <span className="size-2 rounded-full bg-[#32504d] shrink-0" />
                              )}
                            </div>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </ScrollArea>
            </aside>

            {/* RIGHT — conversation view */}
            <section className="flex-1 min-w-0 flex flex-col bg-background">
              {other ? (
                <>
                  {/* top bar */}
                  <header className="flex items-center gap-3 px-3 sm:px-4 h-14 border-b border-border/60 bg-card/40">
                    <button
                      aria-label="Back to conversations"
                      className="md:hidden size-8 rounded-lg hover:bg-muted flex items-center justify-center"
                      onClick={() => setSelectedId(null)}
                    >
                      <ArrowLeft className="size-4" />
                    </button>
                    <Avatar className="size-9 rounded-full">
                      <AvatarImage src={other.avatar} alt={other.name} />
                      <AvatarFallback className="bg-[#32504d]/30 text-[#32504d] text-xs font-semibold">
                        {other.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-semibold truncate">
                          {other.name}
                        </h3>
                        {other.id === "bot-amira" && (
                          <Badge className="text-[9px] gap-0.5 px-1.5 py-0 h-4 bg-[#32504d]/10 text-[#32504d] border-[#32504d]/20">
                            <ShieldCheck className="size-2.5" /> Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        {isOtherTyping ? (
                          <span className="text-[#32504d]">typing…</span>
                        ) : isOtherOnline ? (
                          <>
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            Online
                          </>
                        ) : (
                          "Offline"
                        )}
                      </p>
                    </div>
                    <button
                      aria-label="Close chat"
                      className="size-8 rounded-lg hover:bg-muted flex items-center justify-center"
                      onClick={closeMessaging}
                    >
                      <X className="size-4" />
                    </button>
                  </header>

                  {/* messages */}
                  <ScrollArea className="flex-1 min-h-0">
                    <div className="px-3 sm:px-4 py-4 space-y-2">
                      <AnimatePresence initial={false}>
                        {messages.map((m) => {
                          const isOwn = m.senderId === currentUserId;
                          return (
                            <motion.div
                              key={m.id}
                              initial={{ opacity: 0, y: 8, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ duration: 0.18, ease: "easeOut" }}
                              className={cn(
                                "flex items-end gap-2",
                                isOwn ? "justify-end" : "justify-start"
                              )}
                            >
                              {!isOwn && (
                                <Avatar className="size-7 rounded-full mb-0.5">
                                  <AvatarImage src={other.avatar} alt={other.name} />
                                  <AvatarFallback className="bg-[#32504d]/30 text-[#32504d] text-[10px] font-semibold">
                                    {other.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              <div
                                className={cn(
                                  "max-w-[78%] sm:max-w-[65%] rounded-2xl px-3 py-2 text-xs leading-relaxed",
                                  isOwn
                                    ? "bg-[#32504d] text-white rounded-br-sm"
                                    : "bg-muted text-foreground rounded-bl-sm"
                                )}
                              >
                                <p className="whitespace-pre-wrap break-words">
                                  {m.text}
                                </p>
                                <div
                                  className={cn(
                                    "mt-1 flex items-center gap-1 text-[9px]",
                                    isOwn ? "text-white/70 justify-end" : "text-muted-foreground"
                                  )}
                                >
                                  <span>{clockTime(m.createdAt)}</span>
                                  {isOwn &&
                                    (m.read ? (
                                      <CheckCheck className="size-3 text-white" />
                                    ) : (
                                      <Check className="size-3 text-white/70" />
                                    ))}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>

                      {/* typing indicator */}
                      <AnimatePresence>
                        {isOtherTyping && (
                          <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 6 }}
                            className="flex items-end gap-2"
                          >
                            <Avatar className="size-7 rounded-full mb-0.5">
                              <AvatarImage src={other.avatar} alt={other.name} />
                              <AvatarFallback className="bg-[#32504d]/30 text-[#32504d] text-[10px] font-semibold">
                                {other.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="bg-muted rounded-2xl rounded-bl-sm px-3 py-2.5">
                              <div className="flex items-center gap-1">
                                <Dot />
                                <Dot delay={0.15} />
                                <Dot delay={0.3} />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* composer */}
                  <footer className="px-3 sm:px-4 py-3 border-t border-border/60 bg-card/40">
                    <div className="flex items-end gap-2">
                      <button
                        aria-label="Attach a file"
                        className="size-9 shrink-0 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground"
                        onClick={() =>
                          toast.info("Attachments are coming soon")
                        }
                      >
                        <Paperclip className="size-4" />
                      </button>
                      <button
                        aria-label="Insert emoji"
                        className="size-9 shrink-0 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground"
                        onClick={() =>
                          toast.info("Emoji picker coming soon")
                        }
                      >
                        <Smile className="size-4" />
                      </button>
                      <Textarea
                        ref={textareaRef}
                        rows={1}
                        value={draft}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message…  (Enter to send, Shift+Enter for newline)"
                        className="min-h-[36px] max-h-36 resize-none text-xs leading-relaxed py-2"
                      />
                      <Button
                        size="sm"
                        className="h-9 px-3 shrink-0 bg-[#2b3d3d] hover:bg-[#192d2f] text-white"
                        disabled={!draft.trim()}
                        onClick={handleSend}
                        aria-label="Send message"
                      >
                        <Send className="size-3.5" />
                      </Button>
                    </div>
                  </footer>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-10">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 -m-4 rounded-full bg-[#32504d]/5 blur-2xl" />
                    <div className="relative size-20 rounded-full bg-khidma-gradient flex items-center justify-center mx-auto animate-float">
                      <MessageSquare className="size-9 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold">Select a conversation</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                    Pick a conversation from the list to view messages, or start
                    a new chat with a verified freelancer.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-5 border-[#32504d]/30 text-[#32504d] hover:bg-[#32504d]/5"
                    onClick={() => setShowDiscover(true)}
                  >
                    <PenSquare className="size-3.5" /> Start a new chat
                  </Button>
                  <p className="mt-6 text-[10px] text-muted-foreground/70 flex items-center gap-1">
                    <ShieldCheck className="size-3" /> End-to-end trusted messaging
                  </p>
                </div>
              )}
            </section>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

function Dot({ delay = 0 }: { delay?: number }) {
  return (
    <motion.span
      className="size-1.5 rounded-full bg-[#32504d]/70"
      animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}
