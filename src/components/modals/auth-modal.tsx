"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Briefcase,
  Building2,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { toast } from "sonner";
import { KhidmaLogo } from "@/components/khidma/logo";
import { cn } from "@/lib/utils";

const trustBullets = [
  {
    icon: ShieldCheck,
    title: "Verified Tunisian Talent",
    desc: "Identity, phone & portfolio reviewed by our team",
  },
  {
    icon: Wallet,
    title: "Protected Payments",
    desc: "Escrow-based , funds released only when you approve",
  },
  {
    icon: Users,
    title: "1,248+ Trusted Pros",
    desc: "Across 24 cities and 11 categories",
  },
];

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="text-[11px] text-rose-600 mt-1 ml-1">{msg}</p>
  );
}

interface FormState {
  email: string;
  password: string;
  fullName: string;
  accountType: "FREELANCER" | "CLIENT";
  agree: boolean;
}

export function AuthModal() {
  const {
    modal: { authOpen, authMode },
    closeAuth,
    login,
  } = useApp();

  const [tab, setTab] = useState<"login" | "register">(authMode);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    fullName: "",
    accountType: "FREELANCER",
    agree: false,
  });

  // Sync tab when authMode changes externally
  useEffect(() => {
    setTab(authMode);
  }, [authMode]);

  // Lock body scroll while open
  useEffect(() => {
    if (authOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [authOpen]);

  if (!authOpen) return null;

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (tab === "register" && !form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Min. 6 characters";
    if (tab === "register" && !form.agree) e.agree = "Please accept the Terms";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      const name = tab === "register" ? form.fullName : form.email.split("@")[0];
      login(name, form.accountType === "FREELANCER" ? "freelancer" : "client");
      setLoading(false);
      closeAuth();
      toast.success("Welcome to Khidma!", {
        description: tab === "register"
          ? "Your account has been created."
          : "You're signed in.",
      });
      // reset
      setForm({ email: "", password: "", fullName: "", accountType: "FREELANCER", agree: false });
    }, 600);
  };

  const brandPanel = (
    <div className="relative hidden lg:flex flex-col justify-between p-8 overflow-hidden bg-khidma-gradient text-white">
      {/* Decorative pattern */}
      <div className="absolute -top-12 -right-12 size-56 rounded-full bg-white/5 blur-2xl" />
      <div className="absolute -bottom-16 -left-12 size-72 rounded-full bg-[#6e8580]/20 blur-3xl" />

      <div className="relative">
        <KhidmaLogo size="md" className="[&_span]:text-white" />
        <p className="mt-8 text-2xl font-display font-bold leading-tight">
          Work. Earn. Grow.
        </p>
        <p className="mt-2 text-sm text-white/70 max-w-xs">
          The trusted marketplace connecting verified Tunisian freelancers with clients worldwide.
        </p>
      </div>

      <ul className="relative space-y-4 mt-8">
        {trustBullets.map((b) => {
          const Icon = b.icon;
          return (
            <li key={b.title} className="flex items-start gap-3">
              <span className="size-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <Icon className="size-4 text-white" />
              </span>
              <div>
                <div className="text-sm font-semibold">{b.title}</div>
                <div className="text-xs text-white/60">{b.desc}</div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="relative flex items-center gap-3 mt-8 pt-6 border-t border-white/10">
        <div className="flex -space-x-2">
          {["A", "Y", "S", "M"].map((c) => (
            <span
              key={c}
              className="size-7 rounded-full bg-[#6e8580] border-2 border-[#2b3d3d] flex items-center justify-center text-[10px] font-bold text-white"
            >
              {c}
            </span>
          ))}
        </div>
        <p className="text-xs text-white/70">
          Joined by <span className="font-semibold text-white">8,420+</span> Tunisian pros
        </p>
      </div>
    </div>
  );

  const formPanel = (
    <div className="flex-1 p-6 sm:p-8">
      <Tabs
        value={tab}
        onValueChange={(v) => {
          setTab(v as "login" | "register");
          setErrors({});
        }}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 bg-muted/60">
          <TabsTrigger value="login" className="data-[state=active]:bg-[#2b3d3d] data-[state=active]:text-white">
            Log in
          </TabsTrigger>
          <TabsTrigger value="register" className="data-[state=active]:bg-[#2b3d3d] data-[state=active]:text-white">
            Sign up
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          {tab === "login" ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="login" className="mt-6 space-y-4">
                <div>
                  <h2 className="text-xl font-display font-bold text-foreground">
                    Welcome back
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Sign in to manage your projects and proposals.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        className="pl-9"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        aria-invalid={!!errors.email}
                      />
                    </div>
                    <FieldError msg={errors.email} />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-pwd">Password</Label>
                      <button
                        type="button"
                        onClick={() => toast.info("Password recovery coming soon.")}
                        className="text-xs text-[#32504d] hover:underline dark:text-[#9bb3ae]"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="login-pwd"
                        type={showPwd ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        className="pl-9 pr-9"
                        value={form.password}
                        onChange={(e) => set("password", e.target.value)}
                        aria-invalid={!!errors.password}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={showPwd ? "Hide password" : "Show password"}
                      >
                        {showPwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    <FieldError msg={errors.password} />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#2b3d3d] hover:bg-[#192d2f] text-white"
                  >
                    {loading ? "Signing in…" : "Log in"}
                  </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setTab("register")}
                    className="text-[#32504d] font-semibold hover:underline dark:text-[#9bb3ae]"
                  >
                    Sign up
                  </button>
                </p>
              </TabsContent>
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="register" className="mt-6 space-y-4">
                <div>
                  <h2 className="text-xl font-display font-bold text-foreground">
                    Create your account
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Join Khidma as a freelancer or client , it takes 2 minutes.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-name">Full name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="reg-name"
                        type="text"
                        autoComplete="name"
                        placeholder="e.g. Amira Ben Salah"
                        className="pl-9"
                        value={form.fullName}
                        onChange={(e) => set("fullName", e.target.value)}
                        aria-invalid={!!errors.fullName}
                      />
                    </div>
                    <FieldError msg={errors.fullName} />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="reg-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="reg-email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        className="pl-9"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        aria-invalid={!!errors.email}
                      />
                    </div>
                    <FieldError msg={errors.email} />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="reg-pwd">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="reg-pwd"
                        type={showPwd ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Min. 6 characters"
                        className="pl-9 pr-9"
                        value={form.password}
                        onChange={(e) => set("password", e.target.value)}
                        aria-invalid={!!errors.password}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={showPwd ? "Hide password" : "Show password"}
                      >
                        {showPwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    <FieldError msg={errors.password} />
                  </div>

                  {/* Account type radio cards */}
                  <div className="space-y-1.5">
                    <Label>I am a…</Label>
                    <RadioGroup
                      value={form.accountType}
                      onValueChange={(v) => set("accountType", v as FormState["accountType"])}
                      className="grid grid-cols-2 gap-3"
                    >
                      {[
                        {
                          value: "FREELANCER" as const,
                          icon: Briefcase,
                          title: "Freelancer",
                          desc: "Offer services & apply to jobs",
                        },
                        {
                          value: "CLIENT" as const,
                          icon: Building2,
                          title: "Client",
                          desc: "Hire talent & post jobs",
                        },
                      ].map((opt) => {
                        const Icon = opt.icon;
                        const active = form.accountType === opt.value;
                        return (
                          <label
                            key={opt.value}
                            htmlFor={`acct-${opt.value}`}
                            className={cn(
                              "relative cursor-pointer rounded-xl border p-3 transition-colors",
                              active
                                ? "border-[#32504d] bg-[#32504d]/5 ring-1 ring-[#32504d]/30"
                                : "border-border hover:border-[#32504d]/40"
                            )}
                          >
                            <div className="flex items-start gap-2">
                              <span
                                className={cn(
                                  "size-8 rounded-lg flex items-center justify-center shrink-0",
                                  active ? "bg-[#32504d] text-white" : "bg-muted text-[#2b3d3d]"
                                )}
                              >
                                <Icon className="size-4" />
                              </span>
                              <div className="min-w-0">
                                <div className="text-sm font-semibold">{opt.title}</div>
                                <div className="text-[11px] text-muted-foreground leading-snug">
                                  {opt.desc}
                                </div>
                              </div>
                            </div>
                            <RadioGroupItem
                              id={`acct-${opt.value}`}
                              value={opt.value}
                              className="sr-only"
                            />
                          </label>
                        );
                      })}
                    </RadioGroup>
                  </div>

                  <label
                    htmlFor="agree"
                    className="flex items-start gap-2.5 cursor-pointer text-sm"
                  >
                    <Checkbox
                      id="agree"
                      checked={form.agree}
                      onCheckedChange={(c) => set("agree", c === true)}
                      className="mt-0.5 data-[state=checked]:bg-[#2b3d3d] data-[state=checked]:border-[#2b3d3d]"
                    />
                    <span className="text-muted-foreground leading-snug">
                      I agree to Khidma&apos;s{" "}
                      <span className="text-[#32504d] hover:underline cursor-pointer dark:text-[#9bb3ae]">
                        Terms of Service
                      </span>{" "}
                      and{" "}
                      <span className="text-[#32504d] hover:underline cursor-pointer dark:text-[#9bb3ae]">
                        Privacy Policy
                      </span>
                      .
                    </span>
                  </label>
                  <FieldError msg={errors.agree} />

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#2b3d3d] hover:bg-[#192d2f] text-white"
                  >
                    {loading ? "Creating…" : "Create account"}
                  </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setTab("login")}
                    className="text-[#32504d] font-semibold hover:underline dark:text-[#9bb3ae]"
                  >
                    Log in
                  </button>
                </p>
              </TabsContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Tabs>

      <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
        Demo mode, any email & password will work
      </div>
    </div>
  );

  return (
    <Dialog open={authOpen} onOpenChange={(o) => !o && closeAuth()}>
      <DialogPortal>
        <DialogOverlay className="bg-[#192d2f]/70 backdrop-blur-sm" />
        <DialogContent
          className="p-0 gap-0 max-w-4xl overflow-hidden max-h-[calc(100vh-2rem)] sm:max-w-4xl"
          aria-describedby={undefined}
          showCloseButton
        >
          <DialogTitle className="sr-only">
            {tab === "login" ? "Log in to Khidma" : "Create your Khidma account"}
          </DialogTitle>
          <div className="grid lg:grid-cols-[1.05fr_1fr]">
            {brandPanel}
            {formPanel}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
