"use client";

/**
 * ApiDocsModal
 * ------------
 * "Khidma API" — interactive API reference. Available on Business and
 * Enterprise plans. Opened via `openApiDocs()` from the footer or the
 * Pricing section's Business tier CTA.
 *
 * Structure:
 *   - Header (Khidma gradient)
 *   - Left sidebar (220px, Sheet on mobile): 8 endpoint categories
 *   - Right content: Getting Started card + code examples (4 languages)
 *     + endpoint reference table + webhooks + error codes table
 *   - Footer: "Generate API key" (toast) + contact API team link
 *
 * Self-renders based on `modal.apiDocsOpen` from `useApp()`.
 */

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  X,
  Key,
  Terminal,
  Code2,
  BookOpen,
  Webhook,
  AlertTriangle,
  Users,
  Briefcase,
  FileText,
  CreditCard,
  FolderKanban,
  ChevronRight,
  Menu,
  Copy,
  Check,
  Zap,
  ShieldAlert,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------------
 * Types + data
 * -------------------------------------------------------------------------- */

type CategoryId =
  | "getting-started"
  | "authentication"
  | "freelancers"
  | "services"
  | "jobs"
  | "contracts"
  | "payments"
  | "webhooks"
  | "errors";

interface Category {
  id: CategoryId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const CATEGORIES: Category[] = [
  {
    id: "getting-started",
    label: "Getting Started",
    icon: BookOpen,
    description:
      "Get your API key, learn the base URL, and understand rate limits before making your first request.",
  },
  {
    id: "authentication",
    label: "Authentication",
    icon: Key,
    description:
      "Khidma API uses Bearer tokens. Exchange your API key for a short-lived access token.",
  },
  {
    id: "freelancers",
    label: "Freelancers",
    icon: Users,
    description:
      "Search, filter, and inspect verified freelancer profiles on Khidma.",
  },
  {
    id: "services",
    label: "Services",
    icon: Briefcase,
    description: "Browse catalogued services offered by verified freelancers.",
  },
  {
    id: "jobs",
    label: "Jobs",
    icon: FolderKanban,
    description: "List and inspect public job postings on Khidma.",
  },
  {
    id: "contracts",
    label: "Contracts",
    icon: FileText,
    description: "Create and manage secure escrow-protected contracts.",
  },
  {
    id: "payments",
    label: "Payments",
    icon: CreditCard,
    description: "Fund contracts, release milestones, and inspect wallet balances.",
  },
  {
    id: "webhooks",
    label: "Webhooks",
    icon: Webhook,
    description:
      "Subscribe to real-time events: contract.created, payment.released, and more.",
  },
  {
    id: "errors",
    label: "Errors",
    icon: AlertTriangle,
    description: "Standard HTTP status codes and Khidma error codes.",
  },
];

type Method = "GET" | "POST" | "PUT" | "DELETE";

interface Endpoint {
  method: Method;
  path: string;
  description: string;
  category: Exclude<CategoryId, "getting-started" | "errors">;
}

const ENDPOINTS: Endpoint[] = [
  { method: "POST", path: "/auth/token", description: "Exchange API key for access token", category: "authentication" },
  { method: "GET", path: "/freelancers", description: "List freelancers with filters", category: "freelancers" },
  { method: "GET", path: "/freelancers/:id", description: "Get a single freelancer profile", category: "freelancers" },
  { method: "GET", path: "/services", description: "List services with filters", category: "services" },
  { method: "GET", path: "/services/:id", description: "Get a single service detail", category: "services" },
  { method: "GET", path: "/jobs", description: "List public job postings", category: "jobs" },
  { method: "GET", path: "/jobs/:id", description: "Get a single job detail", category: "jobs" },
  { method: "POST", path: "/contracts", description: "Create a new escrow contract", category: "contracts" },
  { method: "GET", path: "/contracts/:id", description: "Get a contract by ID", category: "contracts" },
  { method: "POST", path: "/payments", description: "Fund a contract or release a milestone", category: "payments" },
  { method: "GET", path: "/wallet", description: "Get wallet balance + transaction history", category: "payments" },
  { method: "POST", path: "/webhooks", description: "Register a webhook endpoint", category: "webhooks" },
];

interface CodeExample {
  title: string;
  description: string;
  language: "curl" | "javascript" | "python" | "php";
  code: string;
}

const CODE_EXAMPLES: Record<string, CodeExample[]> = {
  authentication: [
    {
      title: "Exchange API key for access token",
      description:
        "Send your API key (from Settings → API Access) to receive a 1-hour Bearer token. Include this token in the Authorization header of every subsequent request.",
      language: "curl",
      code: `curl -X POST https://api.khidma.tn/v1/auth/token \\
  -H "Content-Type: application/json" \\
  -d '{
    "api_key": "kh_live_8f3c2a1b9d7e4f6c",
    "grant_type": "api_key"
  }'`,
    },
    {
      title: "Exchange API key for access token",
      description:
        "Send your API key (from Settings → API Access) to receive a 1-hour Bearer token. Include this token in the Authorization header of every subsequent request.",
      language: "javascript",
      code: `const res = await fetch("https://api.khidma.tn/v1/auth/token", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    api_key: process.env.KHIDMA_API_KEY,
    grant_type: "api_key",
  }),
});

const { access_token, expires_in } = await res.json();
console.log("Token expires in", expires_in, "seconds");`,
    },
    {
      title: "Exchange API key for access token",
      description:
        "Send your API key (from Settings → API Access) to receive a 1-hour Bearer token. Include this token in the Authorization header of every subsequent request.",
      language: "python",
      code: `import requests

res = requests.post(
    "https://api.khidma.tn/v1/auth/token",
    json={
        "api_key": os.environ["KHIDMA_API_KEY"],
        "grant_type": "api_key",
    },
)
data = res.json()
access_token = data["access_token"]  # 1-hour TTL`,
    },
    {
      title: "Exchange API key for access token",
      description:
        "Send your API key (from Settings → API Access) to receive a 1-hour Bearer token. Include this token in the Authorization header of every subsequent request.",
      language: "php",
      code: `<?php
$res = file_get_contents("https://api.khidma.tn/v1/auth/token", false, stream_context_create([
    "http" => [
        "method" => "POST",
        "header" => "Content-Type: application/json",
        "content" => json_encode([
            "api_key" => getenv("KHIDMA_API_KEY"),
            "grant_type" => "api_key",
        ]),
    ],
]));
$data = json_decode($res, true);
$accessToken = $data["access_token"];`,
    },
  ],
  freelancers: [
    {
      title: "List freelancers (filtered)",
      description:
        "Filter by category, min rating, hourly rate range, and verified status. Returns paginated results — use ?page=N for the next page.",
      language: "curl",
      code: `curl https://api.khidma.tn/v1/freelancers?category=development&min_rating=4.5&verified=true&limit=10 \\
  -H "Authorization: Bearer $TOKEN"`,
    },
    {
      title: "List freelancers (filtered)",
      description:
        "Filter by category, min rating, hourly rate range, and verified status. Returns paginated results — use ?page=N for the next page.",
      language: "javascript",
      code: `const res = await fetch(
  "https://api.khidma.tn/v1/freelancers?category=development&min_rating=4.5&verified=true&limit=10",
  { headers: { Authorization: \`Bearer \${token}\` } }
);

const { data, has_more } = await res.json();
console.log(\`Got \${data.length} freelancers\`);`,
    },
    {
      title: "List freelancers (filtered)",
      description:
        "Filter by category, min rating, hourly rate range, and verified status. Returns paginated results — use ?page=N for the next page.",
      language: "python",
      code: `import requests

res = requests.get(
    "https://api.khidma.tn/v1/freelancers",
    params={"category": "development", "min_rating": 4.5, "verified": "true", "limit": 10},
    headers={"Authorization": f"Bearer {token}"},
)
data = res.json()["data"]`,
    },
    {
      title: "List freelancers (filtered)",
      description:
        "Filter by category, min rating, hourly rate range, and verified status. Returns paginated results — use ?page=N for the next page.",
      language: "php",
      code: `<?php
$url = "https://api.khidma.tn/v1/freelancers?" . http_build_query([
    "category" => "development",
    "min_rating" => 4.5,
    "verified" => "true",
    "limit" => 10,
]);
$res = file_get_contents($url, false, stream_context_create([
    "http" => ["header" => "Authorization: Bearer $token"],
]));
$data = json_decode($res, true)["data"];`,
    },
  ],
  contracts: [
    {
      title: "Create a contract",
      description:
        "Create an escrow-protected contract between a client and a freelancer. Funds are held by Khidma until milestone completion.",
      language: "curl",
      code: `curl -X POST https://api.khidma.tn/v1/contracts \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "freelancer_id": "fl_8h3k2a9b",
    "job_id": "jb_2c8f1a7e",
    "title": "SaaS landing page redesign",
    "total_amount": 1200.00,
    "currency": "TND",
    "milestones": [
      {"title": "Discovery + wireframes", "amount": 400.00, "due_date": "2025-04-15"},
      {"title": "Final design + handoff", "amount": 800.00, "due_date": "2025-05-01"}
    ]
  }'`,
    },
    {
      title: "Create a contract",
      description:
        "Create an escrow-protected contract between a client and a freelancer. Funds are held by Khidma until milestone completion.",
      language: "javascript",
      code: `const res = await fetch("https://api.khidma.tn/v1/contracts", {
  method: "POST",
  headers: {
    Authorization: \`Bearer \${token}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    freelancer_id: "fl_8h3k2a9b",
    job_id: "jb_2c8f1a7e",
    title: "SaaS landing page redesign",
    total_amount: 1200.00,
    currency: "TND",
    milestones: [
      { title: "Discovery + wireframes", amount: 400.00, due_date: "2025-04-15" },
      { title: "Final design + handoff", amount: 800.00, due_date: "2025-05-01" },
    ],
  }),
});

const { id, status } = await res.json();
console.log("Created contract", id, status);`,
    },
    {
      title: "Create a contract",
      description:
        "Create an escrow-protected contract between a client and a freelancer. Funds are held by Khidma until milestone completion.",
      language: "python",
      code: `import requests

res = requests.post(
    "https://api.khidma.tn/v1/contracts",
    json={
        "freelancer_id": "fl_8h3k2a9b",
        "job_id": "jb_2c8f1a7e",
        "title": "SaaS landing page redesign",
        "total_amount": 1200.00,
        "currency": "TND",
        "milestones": [
            {"title": "Discovery + wireframes", "amount": 400.00, "due_date": "2025-04-15"},
            {"title": "Final design + handoff", "amount": 800.00, "due_date": "2025-05-01"},
        ],
    },
    headers={"Authorization": f"Bearer {token}"},
)
contract = res.json()`,
    },
    {
      title: "Create a contract",
      description:
        "Create an escrow-protected contract between a client and a freelancer. Funds are held by Khidma until milestone completion.",
      language: "php",
      code: `<?php
$payload = [
    "freelancer_id" => "fl_8h3k2a9b",
    "job_id" => "jb_2c8f1a7e",
    "title" => "SaaS landing page redesign",
    "total_amount" => 1200.00,
    "currency" => "TND",
    "milestones" => [
        ["title" => "Discovery + wireframes", "amount" => 400.00, "due_date" => "2025-04-15"],
        ["title" => "Final design + handoff", "amount" => 800.00, "due_date" => "2025-05-01"],
    ],
];
$res = file_get_contents("https://api.khidma.tn/v1/contracts", false, stream_context_create([
    "http" => [
        "method" => "POST",
        "header" => "Authorization: Bearer $token\\r\\nContent-Type: application/json",
        "content" => json_encode($payload),
    ],
]));
$contract = json_decode($res, true);`,
    },
  ],
};

interface WebhookEvent {
  event: string;
  description: string;
  payload: string;
}

const WEBHOOK_EVENTS: WebhookEvent[] = [
  {
    event: "contract.created",
    description: "Fired when a new contract is created (status: pending_funds).",
    payload: `{
  "event": "contract.created",
  "data": {
    "id": "ct_9a8b7c6d",
    "freelancer_id": "fl_8h3k2a9b",
    "client_id": "cl_2f4e1d3c",
    "title": "SaaS landing page redesign",
    "total_amount": 1200.00,
    "currency": "TND",
    "status": "pending_funds",
    "created_at": "2025-03-12T14:23:51Z"
  }
}`,
  },
  {
    event: "payment.released",
    description: "Fired when a milestone payment is released to the freelancer.",
    payload: `{
  "event": "payment.released",
  "data": {
    "contract_id": "ct_9a8b7c6d",
    "milestone_id": "ms_1a2b3c4d",
    "amount": 800.00,
    "currency": "TND",
    "released_to": "fl_8h3k2a9b",
    "released_at": "2025-05-01T09:14:22Z"
  }
}`,
  },
  {
    event: "freelancer.verified",
    description: "Fired when a freelancer passes Khidma verification.",
    payload: `{
  "event": "freelancer.verified",
  "data": {
    "freelancer_id": "fl_8h3k2a9b",
    "verification_type": "identity+portfolio",
    "verified_at": "2025-03-12T16:01:11Z"
  }
}`,
  },
  {
    event: "milestone.completed",
    description: "Fired when a freelancer marks a milestone as completed.",
    payload: `{
  "event": "milestone.completed",
  "data": {
    "contract_id": "ct_9a8b7c6d",
    "milestone_id": "ms_1a2b3c4d",
    "title": "Final design + handoff",
    "completed_at": "2025-04-30T17:45:00Z"
  }
}`,
  },
];

interface ErrorRow {
  code: number;
  name: string;
  description: string;
}

const ERROR_CODES: ErrorRow[] = [
  { code: 400, name: "Bad Request", description: "The request body or query parameters are invalid." },
  { code: 401, name: "Unauthorized", description: "Missing or invalid access token. Re-authenticate via /auth/token." },
  { code: 403, name: "Forbidden", description: "Your plan doesn't include this endpoint, or the resource is not yours." },
  { code: 404, name: "Not Found", description: "The requested resource doesn't exist or has been archived." },
  { code: 429, name: "Too Many Requests", description: "Rate limit exceeded. Wait until the current window resets (1 hour)." },
  { code: 500, name: "Server Error", description: "Something went wrong on our end. Our team is notified automatically." },
];

const RATE_LIMITS = [
  { plan: "Business", limit: "1,000 req / hour" },
  { plan: "Enterprise", limit: "10,000 req / hour" },
];

/* ----------------------------------------------------------------------------
 * Sub-components
 * -------------------------------------------------------------------------- */

function MethodBadge({ method }: { method: Method }) {
  const color =
    method === "GET"
      ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:text-emerald-400"
      : method === "POST"
      ? "bg-amber-500/15 text-amber-700 border-amber-500/30 dark:text-amber-400"
      : method === "PUT"
      ? "bg-sky-500/15 text-sky-700 border-sky-500/30 dark:text-sky-400"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30 dark:text-rose-400";
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center min-w-12 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide border",
        color
      )}
    >
      {method}
    </span>
  );
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard
        .writeText(code)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        })
        .catch(() => {
          toast.error("Failed to copy — please copy manually.");
        });
    } else {
      toast.error("Clipboard unavailable in this browser.");
    }
  };

  return (
    <div className="relative group">
      <pre className="overflow-x-auto rounded-lg bg-[#0e1a1b] text-[#d4e5e0] p-4 text-xs leading-relaxed font-mono border border-[#32504d]/30">
        <code>{code}</code>
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copy ${language} code`}
        className="absolute top-2 right-2 size-7 rounded-md bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors"
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </button>
    </div>
  );
}

function CodeExampleBlock({ examples }: { examples: CodeExample[] }) {
  const [lang, setLang] = useState(examples[0]?.language ?? "curl");
  const active = examples.find((e) => e.language === lang) ?? examples[0];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="font-display text-sm font-semibold text-foreground">
            {active.title}
          </h4>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {active.description}
          </p>
        </div>
      </div>
      <Tabs value={lang} onValueChange={(v) => setLang(v as "curl" | "javascript" | "python" | "php")}>
        <TabsList className="bg-muted/60 h-auto p-0.5">
          {(["curl", "javascript", "python", "php"] as const).map((l) => (
            <TabsTrigger
              key={l}
              value={l}
              className="text-[11px] px-2.5 py-1 data-[state=active]:bg-[#32504d] data-[state=active]:text-white"
            >
              {l === "curl" ? "cURL" : l === "javascript" ? "JS" : l === "python" ? "Python" : "PHP"}
            </TabsTrigger>
          ))}
        </TabsList>
        {(["curl", "javascript", "python", "php"] as const).map((l) => {
          const ex = examples.find((e) => e.language === l);
          if (!ex) return null;
          return (
            <TabsContent key={l} value={l} className="mt-3">
              <CodeBlock code={ex.code} language={l} />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Sidebar
 * -------------------------------------------------------------------------- */

function SidebarList({
  active,
  onSelect,
}: {
  active: CategoryId;
  onSelect: (id: CategoryId) => void;
}) {
  return (
    <nav aria-label="API docs categories" className="space-y-1">
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const isActive = cat.id === active;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left",
              isActive
                ? "bg-[#32504d]/10 text-[#32504d] dark:text-[#9bb3ae] font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span className="flex-1 truncate">{cat.label}</span>
            {isActive && <ChevronRight className="size-3.5" />}
          </button>
        );
      })}
    </nav>
  );
}

/* ----------------------------------------------------------------------------
 * Right content
 * -------------------------------------------------------------------------- */

function RightContent({ category }: { category: Category }) {
  const prefersReduced = useReducedMotion();
  const filteredEndpoints = useMemo(
    () =>
      ["getting-started", "errors", "webhooks"].includes(category.id)
        ? ENDPOINTS.filter((e) => e.category === category.id)
        : ENDPOINTS.filter((e) => e.category === category.id),
    [category.id]
  );

  const examples = CODE_EXAMPLES[category.id];

  return (
    <motion.div
      key={category.id}
      initial={prefersReduced ? undefined : { opacity: 0, y: 8 }}
      animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Category title */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <category.icon className="size-4 text-[#32504d] dark:text-[#9bb3ae]" />
          <h3 className="font-display text-base font-semibold tracking-tight">
            {category.label}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {category.description}
        </p>
      </div>

      {/* Getting started special card */}
      {category.id === "getting-started" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-[#32504d]/25 bg-gradient-to-br from-[#32504d]/8 to-[#6e8580]/5 dark:from-[#32504d]/15 dark:to-[#6e8580]/8 p-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  API Key
                </div>
                <div className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <Key className="size-3.5 text-[#32504d] dark:text-[#9bb3ae]" />
                  Settings → API Access
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  Base URL
                </div>
                <code className="text-xs font-mono text-[#32504d] dark:text-[#9bb3ae] break-all">
                  https://api.khidma.tn/v1
                </code>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  Format
                </div>
                <div className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <Terminal className="size-3.5 text-[#32504d] dark:text-[#9bb3ae]" />
                  JSON over HTTPS
                </div>
              </div>
            </div>
          </div>

          {/* Rate limits */}
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="size-4 text-amber-500" />
              <h4 className="font-display text-sm font-semibold">Rate limits</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {RATE_LIMITS.map((r) => (
                <div
                  key={r.plan}
                  className="rounded-lg border border-border/60 p-3 bg-muted/30"
                >
                  <div className="text-xs text-muted-foreground">{r.plan} plan</div>
                  <div className="font-display text-sm font-semibold mt-0.5">
                    {r.limit}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
              Rate limits reset every hour. Exceeding the limit returns{" "}
              <code className="font-mono text-[#32504d] dark:text-[#9bb3ae]">429 Too Many Requests</code>{" "}
              with a <code className="font-mono">Retry-After</code> header.
            </p>
          </div>

          {/* Quickstart endpoints */}
          <div>
            <h4 className="font-display text-sm font-semibold mb-2 flex items-center gap-2">
              <Code2 className="size-4 text-[#32504d] dark:text-[#9bb3ae]" />
              Quickstart endpoints
            </h4>
            <div className="rounded-xl border border-border/60 overflow-hidden">
              {ENDPOINTS.slice(0, 4).map((ep) => (
                <div
                  key={ep.path + ep.method}
                  className="flex items-center gap-3 px-3 py-2.5 border-b border-border/50 last:border-b-0 hover:bg-muted/30"
                >
                  <MethodBadge method={ep.method} />
                  <code className="text-xs font-mono text-foreground/80 flex-1">
                    {ep.path}
                  </code>
                  <span className="text-xs text-muted-foreground hidden sm:block">
                    {ep.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Code examples */}
      {examples && examples.length > 0 && (
        <div className="rounded-xl border border-border/60 bg-card p-4 sm:p-5">
          <CodeExampleBlock examples={examples} />
        </div>
      )}

      {/* Endpoint reference table */}
      {filteredEndpoints.length > 0 && (
        <div>
          <h4 className="font-display text-sm font-semibold mb-2 flex items-center gap-2">
            <Terminal className="size-4 text-[#32504d] dark:text-[#9bb3ae]" />
            Endpoints
          </h4>
          <div className="rounded-xl border border-border/60 overflow-hidden">
            <div className="grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_2fr] gap-x-3 gap-y-0 px-3 py-2 bg-muted/40 border-b border-border/60 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              <div className="min-w-12">Method</div>
              <div>Path</div>
              <div className="hidden sm:block">Description</div>
            </div>
            {filteredEndpoints.map((ep) => (
              <div
                key={ep.path + ep.method}
                className="grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_2fr] gap-x-3 items-center px-3 py-2.5 border-b border-border/50 last:border-b-0 hover:bg-muted/30 transition-colors"
              >
                <MethodBadge method={ep.method} />
                <code className="text-xs font-mono text-foreground/80 break-all">
                  {ep.path}
                </code>
                <span className="text-xs text-muted-foreground hidden sm:block">
                  {ep.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Webhooks list (webhooks category only) */}
      {category.id === "webhooks" && (
        <div className="space-y-3">
          <h4 className="font-display text-sm font-semibold flex items-center gap-2">
            <Webhook className="size-4 text-[#32504d] dark:text-[#9bb3ae]" />
            Webhook events
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Register your webhook endpoint via{" "}
            <code className="font-mono text-[#32504d] dark:text-[#9bb3ae]">POST /webhooks</code>.
            Khidma sends a POST request with the event payload to your URL — verify the
            signature in the <code className="font-mono">X-Khidma-Signature</code> header.
          </p>
          {WEBHOOK_EVENTS.map((wh) => (
            <div
              key={wh.event}
              className="rounded-xl border border-border/60 bg-card overflow-hidden"
            >
              <div className="px-4 py-2.5 bg-muted/40 border-b border-border/60">
                <code className="text-sm font-mono font-semibold text-[#32504d] dark:text-[#9bb3ae]">
                  {wh.event}
                </code>
              </div>
              <div className="px-4 py-2">
                <p className="text-xs text-muted-foreground mb-2">{wh.description}</p>
                <CodeBlock code={wh.payload} language="json" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error codes table (errors category only) */}
      {category.id === "errors" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="size-4 text-rose-500" />
            <h4 className="font-display text-sm font-semibold">Error codes</h4>
          </div>
          <div className="rounded-xl border border-border/60 overflow-hidden">
            <div className="grid grid-cols-[auto_1fr_2fr] gap-x-3 px-3 py-2 bg-muted/40 border-b border-border/60 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              <div className="min-w-10">Code</div>
              <div>Name</div>
              <div>Description</div>
            </div>
            {ERROR_CODES.map((err) => (
              <div
                key={err.code}
                className="grid grid-cols-[auto_1fr_2fr] gap-x-3 items-start px-3 py-2.5 border-b border-border/50 last:border-b-0"
              >
                <span
                  className={cn(
                    "font-mono text-xs font-bold px-1.5 py-0.5 rounded",
                    err.code >= 500
                      ? "bg-rose-500/15 text-rose-700 dark:text-rose-400"
                      : err.code >= 400
                      ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                      : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                  )}
                >
                  {err.code}
                </span>
                <div>
                  <div className="text-xs font-medium">{err.name}</div>
                </div>
                <span className="text-xs text-muted-foreground leading-relaxed">
                  {err.description}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            All errors return a JSON body with an <code className="font-mono">error</code> object
            containing <code className="font-mono">code</code>,{" "}
            <code className="font-mono">message</code>, and{" "}
            <code className="font-mono">request_id</code> fields for easier debugging.
          </p>
        </div>
      )}
    </motion.div>
  );
}

/* ----------------------------------------------------------------------------
 * Modal
 * -------------------------------------------------------------------------- */

export function ApiDocsModal() {
  const {
    modal: { apiDocsOpen },
    closeApiDocs,
  } = useApp();
  const [active, setActive] = useState<CategoryId>("getting-started");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const activeCategory = CATEGORIES.find((c) => c.id === active) ?? CATEGORIES[0];

  const handleSelect = (id: CategoryId) => {
    setActive(id);
    setMobileNavOpen(false);
  };

  const handleGenerateKey = () => {
    toast.error("API key generation requires Business plan", {
      description: "Upgrade to Khidma Business to generate your live API key.",
    });
  };

  return (
    <Dialog open={apiDocsOpen} onOpenChange={(o) => !o && closeApiDocs()}>
      <DialogPortal>
        <DialogOverlay className="bg-[#192d2f]/70 backdrop-blur-sm" />
        <DialogContent
          className="max-w-4xl w-[calc(100%-2rem)] h-[85vh] p-0 gap-0 overflow-hidden flex flex-col"
          aria-describedby={undefined}
          showCloseButton={false}
        >
          {/* Header */}
          <DialogHeader className="relative px-5 sm:px-6 pt-5 pb-4 bg-gradient-to-br from-[#192d2f] via-[#2b3d3d] to-[#32504d] text-white overflow-hidden shrink-0">
            <div
              className="absolute inset-0 opacity-[0.05] pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
              aria-hidden
            />
            <div className="relative flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <DialogTitle className="flex items-center gap-2 text-lg font-display font-bold">
                  <Code2 className="size-5 text-[#9bb3ae]" />
                  Khidma API
                </DialogTitle>
                <DialogDescription className="text-white/75 text-xs sm:text-sm mt-1">
                  Build on top of Khidma. Available on Business and Enterprise plans.
                </DialogDescription>
              </div>
              <Badge className="bg-white/10 border-white/15 text-white">
                v1 · stable
              </Badge>
            </div>
          </DialogHeader>

          {/* Body — sidebar + content */}
          <div className="flex-1 flex min-h-0">
            {/* Desktop sidebar */}
            <aside className="hidden md:flex md:w-[220px] md:shrink-0 flex-col border-r border-border/60 bg-muted/30 p-3">
              <SidebarList active={active} onSelect={handleSelect} />
            </aside>

            {/* Mobile sidebar trigger */}
            <div className="md:hidden border-b border-border/60 px-4 py-2.5 flex items-center justify-between bg-muted/30 shrink-0">
              <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Menu className="size-4" />
                    <span className="text-xs">{activeCategory.label}</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] sm:max-w-[280px] p-4 overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="text-sm">API categories</SheetTitle>
                  </SheetHeader>
                  <div className="mt-3">
                    <SidebarList active={active} onSelect={handleSelect} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1 min-w-0">
              <div className="p-5 sm:p-6">
                <RightContent category={activeCategory} />
              </div>
            </ScrollArea>
          </div>

          {/* Footer */}
          <div className="shrink-0 border-t border-border/60 px-5 sm:px-6 py-3 bg-muted/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              Need more endpoints?{" "}
              <a
                href="mailto:api@khidma.tn"
                className="font-medium text-[#32504d] dark:text-[#9bb3ae] hover:underline"
              >
                Contact our API team
              </a>
              .
            </p>
            <Button
              size="sm"
              className="bg-[#32504d] hover:bg-[#475959] text-white gap-1.5 shrink-0"
              onClick={handleGenerateKey}
            >
              <Key className="size-3.5" />
              Generate API key
            </Button>
          </div>

          <DialogClose
            className="absolute top-4 right-4 z-10 size-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="size-4" />
          </DialogClose>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
