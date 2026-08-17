import { useEffect, useState } from "react";
import { currentUser, fmt } from "../data";
import { useCountUp } from "../lib/hooks";
import {
  BadgeCheck, Bulb, Chat, Flame, GradCap, Spark, Studio, Trophy,
} from "./icons";

const TOP_ARTICLES = [
  { title: "How I survived Level 100", views: 5821 },
  { title: "7 side hustles for students", views: 4212 },
  { title: "My internship experience", views: 2904 },
  { title: "Hostel food, ranked", views: 1890 },
];

const WEEK = [32, 48, 41, 65, 58, 84, 102, 91, 120, 143, 131, 168];

function Stat({ label, value, suffix, delay }: { label: string; value: number; suffix?: string; delay: number }) {
  const n = useCountUp(value);
  return (
    <div
      className="reveal rounded-xl border-2 border-ink bg-card p-4 shadow-block-sm transition-all hover:-translate-y-0.5 hover:shadow-block"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ink-soft">{label}</p>
      <p className="mt-1 font-display text-3xl font-extrabold tracking-tight">
        {n.toLocaleString()}{suffix}
      </p>
    </div>
  );
}

export function StudioView({ notify }: { notify: (msg: string) => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const maxViews = Math.max(...TOP_ARTICLES.map((a) => a.views));
  const maxWeek = Math.max(...WEEK);
  const pts = WEEK.map((v, i) => `${(i / (WEEK.length - 1)) * 300},${78 - (v / maxWeek) * 66}`).join(" ");

  return (
    <div>
      {/* Banner */}
      <div className="relative overflow-hidden rounded-xl border-2 border-ink bg-pine p-6 text-paper shadow-block sm:p-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.13]"
          style={{ backgroundImage: "radial-gradient(var(--color-gold) 1.4px, transparent 1.4px)", backgroundSize: "16px 16px" }}
        />
        <span className="stamp-in absolute right-6 top-6 hidden rotate-[-6deg] rounded-md border-2 border-gold px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-gold sm:block">
          Creator studio
        </span>
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid h-20 w-20 shrink-0 place-items-center rounded-xl border-2 border-paper/30 bg-gold font-display text-2xl font-extrabold text-ink shadow-block-gold">
              {currentUser.initials}
            </span>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                Welcome back
              </p>
              <h1 className="mt-0.5 flex items-center gap-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                {currentUser.name} <BadgeCheck className="h-6 w-6 text-gold" />
              </h1>
              <p className="mt-1 font-mono text-[11px] text-paper/80">
                {currentUser.level} · {currentUser.dept} · Heritage Christian University
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {currentUser.badges.map((b, i) => (
              <span
                key={b}
                className="flex items-center gap-1 rounded-md border-2 border-paper/25 bg-ink/30 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-paper"
              >
                {i === 0 ? <Trophy className="h-3 w-3 text-gold" /> : i === 1 ? <Flame className="h-3 w-3 text-gold" /> : i === 2 ? <GradCap className="h-3 w-3 text-gold" /> : <Spark className="h-3 w-3 text-gold" />}
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Total views" value={18420} delay={0} />
        <Stat label="Followers" value={currentUser.followers} delay={60} />
        <Stat label="Articles" value={currentUser.articles} delay={120} />
        <Stat label="Engagement" value={7821} delay={180} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Chart */}
        <section className="reveal overflow-hidden rounded-xl border-2 border-ink bg-card shadow-block-sm">
          <header className="flex items-center justify-between border-b-2 border-ink bg-paper px-5 py-3">
            <p className="flex items-center gap-1.5 font-display text-base font-extrabold">
              <Studio className="h-4 w-4 text-pine" /> Views — last 12 weeks
            </p>
            <span className="rounded-md bg-moss/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-pine">
              ↑ 38% vs prev.
            </span>
          </header>
          <div className="p-5">
            <svg viewBox="0 0 300 84" className="w-full">
              <polyline
                points={`0,84 ${pts} 300,84`}
                fill="var(--color-gold)"
                opacity="0.25"
                stroke="none"
              />
              <polyline
                points={pts}
                fill="none"
                stroke="var(--color-pine)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="spark-line"
              />
              {WEEK.map((v, i) => (
                <circle
                  key={i}
                  cx={(i / (WEEK.length - 1)) * 300}
                  cy={78 - (v / maxWeek) * 66}
                  r="2.6"
                  fill={i === WEEK.length - 1 ? "var(--color-rasp)" : "var(--color-ink)"}
                />
              ))}
            </svg>
            <div className="mt-2 flex justify-between font-mono text-[9px] uppercase tracking-wider text-ink-soft">
              <span>Jun</span><span>Jul</span><span>Aug</span><span>Sep — now</span>
            </div>
          </div>
        </section>

        {/* Earnings */}
        <section className="reveal overflow-hidden rounded-xl border-2 border-ink bg-ink text-paper shadow-block" style={{ transitionDelay: "80ms" }}>
          <header className="border-b-2 border-paper/15 px-5 py-3">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
              Estimated earnings
            </p>
          </header>
          <div className="p-5">
            <p className="font-display text-4xl font-extrabold tracking-tight">
              GHS 482<span className="text-2xl">.50</span>
              <span className="ml-2 align-middle font-mono text-[10px] font-semibold uppercase tracking-wider text-paper/60">this month</span>
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg border-2 border-paper/15 bg-paper/5 p-3">
                <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-paper/60">Available</p>
                <p className="mt-0.5 font-display text-xl font-extrabold text-gold">GHS 312.00</p>
              </div>
              <div className="rounded-lg border-2 border-paper/15 bg-paper/5 p-3">
                <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-paper/60">Pending</p>
                <p className="mt-0.5 font-display text-xl font-extrabold">GHS 170.50</p>
              </div>
            </div>
            <button
              onClick={() => notify("Withdrawal to Mobile Money queued — arrives in ~10 min")}
              className="mt-4 w-full rounded-lg border-2 border-gold bg-gold px-4 py-2.5 font-display text-sm font-bold text-ink transition-all hover:-translate-y-0.5 hover:shadow-block-gold active:translate-y-0"
            >
              Withdraw to MoMo
            </button>
            <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-wider text-paper/50">
              Paid from reader support + sponsored placements
            </p>
          </div>
        </section>
      </div>

      {/* Top articles */}
      <section className="reveal mt-6 overflow-hidden rounded-xl border-2 border-ink bg-card shadow-block-sm" style={{ transitionDelay: "120ms" }}>
        <header className="flex items-center justify-between border-b-2 border-ink bg-paper px-5 py-3">
          <p className="font-display text-base font-extrabold">Your top articles</p>
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">All time</span>
        </header>
        <ul>
          {TOP_ARTICLES.map((a, i) => (
            <li key={a.title} className="border-b border-line/70 px-5 py-3.5 last:border-0">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs font-bold text-line">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 font-display text-sm font-bold">{a.title}</span>
                <span className="font-mono text-[11px] font-semibold text-ink-soft">{a.views.toLocaleString()} views</span>
              </div>
              <div className="ml-8 mt-2 h-3 overflow-hidden rounded-full border border-ink/15 bg-paper">
                <div
                  className="bar-fill h-full rounded-full bg-pine"
                  style={{ width: mounted ? `${(a.views / maxViews) * 100}%` : "0%" }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Engagement + premium */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="reveal rounded-xl border-2 border-ink bg-card p-5 shadow-block-sm" style={{ transitionDelay: "140ms" }}>
          <p className="font-display text-base font-extrabold">What readers did with your stories</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg border-2 border-ink/15 bg-paper px-4 py-3">
              <Bulb className="h-6 w-6 text-gold" filled />
              <div>
                <p className="font-display text-xl font-extrabold">2,140</p>
                <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-ink-soft">found useful</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border-2 border-ink/15 bg-paper px-4 py-3">
              <Chat className="h-6 w-6 text-pine" />
              <div>
                <p className="font-display text-xl font-extrabold">486</p>
                <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-ink-soft">comments</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border-2 border-ink/15 bg-paper px-4 py-3">
              <Spark className="h-6 w-6 text-rasp" />
              <div>
                <p className="font-display text-xl font-extrabold">312</p>
                <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-ink-soft">shares</p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            Your GHS 200 business story is your most-shared article ever. Readers love real numbers — consider a monthly update series.
          </p>
        </section>

        <section className="reveal relative overflow-hidden rounded-xl border-2 border-ink bg-gold p-5 shadow-block" style={{ transitionDelay: "160ms" }}>
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{ backgroundImage: "radial-gradient(var(--color-ink) 1.2px, transparent 1.2px)", backgroundSize: "14px 14px" }}
          />
          <div className="relative">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink/70">
              CampusVoice Premium
            </p>
            <p className="mt-1 font-display text-2xl font-extrabold leading-tight">
              Unlock the full creator toolkit
            </p>
            <ul className="mt-3 space-y-1.5 text-sm font-semibold">
              {["Advanced analytics & audience insights", "Featured placement on My Campus", "Monthly newsletter to your followers", "Priority monetization reviews"].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => notify("Premium trial started — 30 days free, cancel anytime")}
              className="mt-4 w-full rounded-lg border-2 border-ink bg-ink px-4 py-2.5 font-display text-sm font-bold text-gold transition-all hover:-translate-y-0.5 hover:shadow-block active:translate-y-0"
            >
              Try 30 days free · then GHS 15/mo
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
