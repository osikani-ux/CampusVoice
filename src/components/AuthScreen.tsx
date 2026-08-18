import { useState } from "react";
import { CAMPUSES, COURSE_SUGGESTIONS, LEVELS, fmt, initialsOf, colorFor } from "../data";
import type { User } from "../data";
import { getAccounts, login, signup } from "../lib/auth";
import { BadgeCheck, GradCap, Lock, Mail, Megaphone, Pen, Spark, Users } from "./icons";

type Mode = "login" | "signup";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Field({
  label, error, children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ink-soft">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs font-semibold text-rasp">{error}</span>}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border-2 border-ink bg-card px-3 py-2.5 text-sm placeholder:text-ink-soft/50 focus:bg-white focus:shadow-block-sm";

export function AuthScreen({ onAuthed }: { onAuthed: (u: User, isNew: boolean) => void }) {
  const [mode, setMode] = useState<Mode>("signup");
  const [accounts, setAccounts] = useState<User[]>(() => getAccounts());

  // signup state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [school, setSchool] = useState(CAMPUSES[0]);
  const [level, setLevel] = useState(LEVELS[0]);
  const [course, setCourse] = useState("");
  const [password, setPassword] = useState("");

  // login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const switchMode = (m: Mode) => {
    setMode(m);
    setErrors({});
  };

  const submitSignup = () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = "Tell us your full name (2+ characters).";
    if (!EMAIL_RE.test(email)) e.email = "Enter a valid email address.";
    if (course.trim().length < 2) e.course = "What are you studying?";
    if (password.length < 4) e.password = "Password needs at least 4 characters.";
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setBusy(true);
    window.setTimeout(() => {
      const verified = email.trim().toLowerCase().endsWith(".edu.gh") || email.trim().toLowerCase().endsWith(".edu");
      const res = signup({ name, email, school, level, course, password }, verified);
      setBusy(false);
      if (res.error) {
        setErrors({ email: res.error });
        return;
      }
      if (res.user) onAuthed(res.user, true);
    }, 500);
  };

  const submitLogin = (em?: string) => {
    const useEmail = em ?? loginEmail;
    const e: Record<string, string> = {};
    if (!EMAIL_RE.test(useEmail)) e.loginEmail = "Enter the email you registered with.";
    if (!em && loginPassword.length < 1) e.loginPassword = "Enter your password.";
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setBusy(true);
    window.setTimeout(() => {
      const res = login(useEmail, em ? "" : loginPassword);
      setBusy(false);
      if (res.error) {
        setErrors({ form: res.error });
        return;
      }
      if (res.user) onAuthed(res.user, false);
    }, 400);
  };

  const firstName = name.trim().split(/\s+/)[0] || "student";

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* ------- Brand panel ------- */}
      <div className="relative hidden overflow-hidden border-r-2 border-ink bg-pine text-paper lg:flex lg:flex-col lg:justify-between lg:p-10">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.13]"
          style={{ backgroundImage: "radial-gradient(var(--color-gold) 1.4px, transparent 1.4px)", backgroundSize: "18px 18px" }}
        />
        <div className="relative flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-xl border-2 border-ink bg-gold shadow-block-sm">
            <Megaphone className="h-6 w-6 text-ink" />
          </span>
          <span className="font-display text-2xl font-extrabold tracking-tight">
            Campus<span className="text-gold">Voice</span>
          </span>
        </div>

        <div className="relative max-w-md">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-gold">
            The voice of every campus
          </p>
          <h1 className="mt-3 font-display text-5xl font-extrabold leading-[1.02] tracking-tight">
            Your campus is talking.
            <span className="mt-2 block bg-gold px-3 text-ink shadow-block-sm">Get in the conversation.</span>
          </h1>
          <ul className="mt-8 space-y-3.5">
            {[
              { icon: Pen, text: "Publish stories, confessions and campus scoops" },
              { icon: Users, text: "Follow writers, clubs, SRC and your halls" },
              { icon: Spark, text: "Vote in polls that reach the Dean's desk" },
              { icon: BadgeCheck, text: "Verified students only — no outsiders, no bots" },
            ].map((f) => (
              <li key={f.text} className="flex items-center gap-3 text-[15px] font-semibold text-paper/90">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border-2 border-paper/25 bg-ink/30">
                  <f.icon className="h-4 w-4 text-gold" />
                </span>
                {f.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex items-center gap-4 font-mono text-[11px] uppercase tracking-wider text-paper/70">
          <span className="flex items-center gap-1.5">
            <GradCap className="h-4 w-4 text-gold" /> {CAMPUSES.length * 12} campuses
          </span>
          <span className="h-1 w-1 rotate-45 bg-gold" />
          <span>{fmt(48210)} students</span>
          <span className="h-1 w-1 rotate-45 bg-gold" />
          <span>est. 2026</span>
        </div>
      </div>

      {/* ------- Form panel ------- */}
      <div className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          {/* Mobile brand */}
          <div className="mb-6 flex items-center gap-2.5 lg:hidden">
            <span className="grid h-10 w-10 place-items-center rounded-lg border-2 border-ink bg-gold shadow-block-sm">
              <Megaphone className="h-5 w-5 text-ink" />
            </span>
            <span className="font-display text-xl font-extrabold">
              Campus<span className="text-pine">Voice</span>
            </span>
            <span className="ml-auto font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-ink-soft">
              The voice of every campus
            </span>
          </div>

          <div className="overflow-hidden rounded-xl border-2 border-ink bg-card shadow-block">
            <div className="border-b-2 border-ink bg-paper px-6 pb-0 pt-5">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-pine">
                {mode === "signup" ? "Join your campus" : "Welcome back"}
              </p>
              <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight">
                {mode === "signup" ? "Create your account" : "Log in to CampusVoice"}
              </h2>

              {/* Mode tabs */}
              <div className="mt-4 flex">
                <button
                  onClick={() => switchMode("signup")}
                  className={`flex-1 border-2 border-b-0 px-4 py-2.5 font-display text-sm font-bold transition-colors ${
                    mode === "signup"
                      ? "rounded-t-lg border-ink bg-card text-ink"
                      : "border-transparent text-ink-soft hover:text-ink"
                  }`}
                >
                  Create account
                </button>
                <button
                  onClick={() => switchMode("login")}
                  className={`flex-1 border-2 border-b-0 px-4 py-2.5 font-display text-sm font-bold transition-colors ${
                    mode === "login"
                      ? "rounded-t-lg border-ink bg-card text-ink"
                      : "border-transparent text-ink-soft hover:text-ink"
                  }`}
                >
                  Log in
                </button>
              </div>
            </div>

            <div className="space-y-4 p-6">
              {errors.form && (
                <p className="rounded-lg border-2 border-rasp bg-rasp/10 px-3.5 py-2.5 text-sm font-semibold text-rasp">
                  {errors.form}
                </p>
              )}

              {mode === "signup" ? (
                <>
                  <Field label="Full name" error={errors.name}>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Yaw Mensah"
                      className={inputCls}
                      autoFocus
                    />
                  </Field>
                  <Field label="Student email" error={errors.email}>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@st.hcu.edu.gh"
                        className={`${inputCls} pl-9`}
                        type="email"
                      />
                    </div>
                    <span className="mt-1 block font-mono text-[10px] text-ink-soft">
                      .edu / .edu.gh emails get instant <BadgeCheck className="inline h-3 w-3 text-cobalt" /> verified status
                    </span>
                  </Field>
                  <Field label="School / University">
                    <select value={school} onChange={(e) => setSchool(e.target.value)} className={inputCls}>
                      {CAMPUSES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Level">
                      <select value={level} onChange={(e) => setLevel(e.target.value)} className={inputCls}>
                        {LEVELS.map((l) => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Course" error={errors.course}>
                      <input
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        placeholder="e.g. Nursing"
                        className={inputCls}
                        list="cv-courses"
                      />
                      <datalist id="cv-courses">
                        {COURSE_SUGGESTIONS.map((c) => (
                          <option key={c} value={c} />
                        ))}
                      </datalist>
                    </Field>
                  </div>
                  <Field label="Password" error={errors.password}>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                      <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="At least 4 characters"
                        className={`${inputCls} pl-9`}
                        onKeyDown={(e) => e.key === "Enter" && submitSignup()}
                      />
                    </div>
                  </Field>

                  <button
                    onClick={submitSignup}
                    disabled={busy}
                    className="w-full rounded-lg border-2 border-ink bg-gold px-5 py-3 font-display text-base font-bold shadow-block transition-all hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_var(--color-ink)] active:translate-y-0 active:shadow-block-sm disabled:opacity-60"
                  >
                    {busy ? "Setting up your voice…" : `Join CampusVoice as ${firstName}`}
                  </button>
                  <p className="text-center font-mono text-[10px] uppercase tracking-wider text-ink-soft">
                    By joining you agree to the campus guidelines · harassment-free zone
                  </p>
                </>
              ) : (
                <>
                  {accounts.length > 0 && (
                    <div className="space-y-2">
                      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ink-soft">
                        Continue as
                      </p>
                      {accounts.map((a) => (
                        <button
                          key={a.email}
                          onClick={() => submitLogin(a.email)}
                          className="flex w-full items-center gap-3 rounded-lg border-2 border-ink/25 bg-paper px-3 py-2.5 text-left transition-all hover:-translate-y-0.5 hover:border-ink hover:bg-gold/20 hover:shadow-block-sm"
                        >
                          <span
                            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border-2 border-ink font-display text-xs font-extrabold text-paper"
                            style={{ backgroundColor: colorFor(a.name + a.email) }}
                          >
                            {initialsOf(a.name)}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-bold">{a.name}</span>
                            <span className="block truncate font-mono text-[10px] text-ink-soft">{a.email}</span>
                          </span>
                          <span className="font-mono text-[10px] font-bold uppercase text-pine">Open →</span>
                        </button>
                      ))}
                      <div className="flex items-center gap-3 py-1">
                        <span className="h-0.5 flex-1 bg-line" />
                        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">or with email</span>
                        <span className="h-0.5 flex-1 bg-line" />
                      </div>
                    </div>
                  )}

                  <Field label="Student email" error={errors.loginEmail}>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                      <input
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="you@st.hcu.edu.gh"
                        className={`${inputCls} pl-9`}
                        type="email"
                        autoFocus
                      />
                    </div>
                  </Field>
                  <Field label="Password" error={errors.loginPassword}>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                      <input
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        type="password"
                        placeholder="Your password"
                        className={`${inputCls} pl-9`}
                        onKeyDown={(e) => e.key === "Enter" && submitLogin()}
                      />
                    </div>
                  </Field>

                  <button
                    onClick={() => submitLogin()}
                    disabled={busy}
                    className="w-full rounded-lg border-2 border-ink bg-gold px-5 py-3 font-display text-base font-bold shadow-block transition-all hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_var(--color-ink)] active:translate-y-0 active:shadow-block-sm disabled:opacity-60"
                  >
                    {busy ? "Checking…" : "Log in →"}
                  </button>
                  <p className="text-center text-sm text-ink-soft">
                    New here?{" "}
                    <button onClick={() => switchMode("signup")} className="font-bold text-pine underline decoration-gold decoration-2 underline-offset-2">
                      Create an account
                    </button>
                  </p>
                </>
              )}
            </div>
          </div>

          <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-wider text-ink-soft">
            Accounts live in your browser · demo build, no server
          </p>
        </div>
      </div>
    </div>
  );
}
