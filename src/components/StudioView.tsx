import { useEffect, useState } from "react";
import { fmt } from "../data";
import type { Draft, Writer } from "../data";
import { useCountUp } from "../lib/hooks";
import {
  BadgeCheck, Bulb, Chat, Flame, GradCap, Pen, Spark, Studio, TrashIcon, Trophy,
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

export function StudioView({
  drafts, onEditDraft, onDeleteDraft, me, school,
}: {
  drafts: Draft[];
  onEditDraft: (d: Draft) => void;
  onDeleteDraft: (id: string) => void;
  me: Writer;
  school: string;
}) {
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
            <span
              className="grid h-20 w-20 shrink-0 place-items-center rounded-xl border-2 border-paper/30 font-display text-2xl font-extrabold text-paper shadow-block-gold"
              style={{ backgroundColor: me.color }}
            >
              {me.initials}
            </span>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                Welcome back
              </p>
              <h1 className="mt-0.5 flex items-center gap-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                {me.name} {me.verified && <BadgeCheck className="h-6 w-6 text-gold" />}
              </h1>
              <p className="mt-1 font-mono text-[11px] text-paper/80">
                {me.level} · {me.dept} · {school}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {me.badges.map((b, i) => (
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
        <Stat label="Followers" value={me.followers} delay={60} />
        <Stat label="Articles" value={me.articles} delay={120} />
        <Stat label="Engagement" value={7821} delay={180} />
      </div>

      <div className="mt-6">
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

      {/* Drafts */}
      {drafts.length > 0 && (
        <section className="reveal mt-6 overflow-hidden rounded-xl border-2 border-ink bg-card shadow-block-sm" style={{ transitionDelay: "110ms" }}>
          <header className="flex items-center justify-between border-b-2 border-ink bg-paper px-5 py-3">
            <p className="flex items-center gap-1.5 font-display text-base font-extrabold">
              <Pen className="h-4 w-4 text-pine" /> Your drafts
            </p>
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">{drafts.length} saved</span>
          </header>
          <ul>
            {drafts.map((d) => (
              <li key={d.id} className="flex items-center gap-3 border-b border-line/70 px-5 py-3.5 last:border-0">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border-2 border-ink/25 bg-paper font-display text-xs font-extrabold text-ink-soft">
                  {d.title[0]?.toUpperCase() ?? "?"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-sm font-bold">{d.title}</p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
                    {d.category} · saved {d.updated}
                  </p>
                </div>
                <button
                  onClick={() => onEditDraft(d)}
                  className="rounded-lg border-2 border-ink bg-gold px-3 py-1.5 font-display text-xs font-bold transition-all hover:-translate-y-0.5 hover:shadow-block-sm active:translate-y-0"
                >
                  Resume
                </button>
                <button
                  onClick={() => onDeleteDraft(d.id)}
                  className="grid h-8 w-8 place-items-center rounded-lg border-2 border-ink/20 text-ink-soft transition-all hover:-translate-y-0.5 hover:border-rasp hover:text-rasp hover:shadow-block-sm active:translate-y-0"
                  aria-label={`Delete draft ${d.title}`}
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Engagement */}
      <div className="mt-6 grid gap-6">
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
      </div>
    </div>
  );
}
