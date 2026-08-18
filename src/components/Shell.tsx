import { useState } from "react";
import type { ReactElement } from "react";
import {
  CAMPUSES,
  notifications as initialNotifications,
  tickerItems,
  fmt,
} from "../data";
import type { Writer } from "../data";
import {
  Megaphone, HomeIcon, Compass, Calendar, Store, Studio, Pen,
  SearchIcon, Bell, GradCap, BadgeCheck, Trophy, Check, CloseIcon, LogOut,
} from "./icons";

export type View = "feed" | "discover" | "events" | "market" | "studio";

const NAV: { id: View; label: string; icon: (p: { className?: string }) => ReactElement; badge?: string }[] = [
  { id: "feed", label: "My Feed", icon: HomeIcon },
  { id: "discover", label: "Discover", icon: Compass, badge: "NEW" },
  { id: "events", label: "Events", icon: Calendar, badge: "6" },
  { id: "market", label: "Marketplace", icon: Store },
  { id: "studio", label: "Creator Studio", icon: Studio },
];

/* ---------------- Top bar ---------------- */

export function TopBar({
  onNav, onWrite, query, onQuery, campus, onCampus, notify, me, onLogout,
}: {
  onNav: (v: View) => void;
  onWrite: () => void;
  query: string;
  onQuery: (q: string) => void;
  campus: string;
  onCampus: (c: string) => void;
  notify: (msg: string) => void;
  me: Writer;
  onLogout: () => void;
}) {
  const [campusOpen, setCampusOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [notifs, setNotifs] = useState(initialNotifications);
  const unread = notifs.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-3 px-4 lg:px-6">
        {/* Logo */}
        <button
          onClick={() => onNav("feed")}
          className="group flex shrink-0 items-center gap-2.5"
          aria-label="CampusVoice home"
        >
          <span className="grid h-10 w-10 place-items-center rounded-lg border-2 border-ink bg-gold shadow-block-sm transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-105">
            <Megaphone className="h-5 w-5 text-ink" />
          </span>
          <span className="text-left leading-none">
            <span className="font-display text-xl font-extrabold tracking-tight">
              Campus<span className="text-pine">Voice</span>
            </span>
            <span className="mt-0.5 hidden font-mono text-[9px] font-medium uppercase tracking-[0.22em] text-ink-soft sm:block">
              The voice of every campus
            </span>
          </span>
        </button>

        {/* Campus selector */}
        <div className="relative ml-2 hidden md:block">
          <button
            onClick={() => setCampusOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg border-2 border-ink bg-card px-3 py-1.5 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-block-sm"
          >
            <GradCap className="h-4 w-4 text-pine" />
            <span className="max-w-[180px] truncate">{campus}</span>
            <svg className={`h-3 w-3 transition-transform ${campusOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m6 9 6 6 6-6" /></svg>
          </button>
          {campusOpen && (
            <>
              <button className="fixed inset-0 z-10 cursor-default" aria-label="Close" onClick={() => setCampusOpen(false)} />
              <div className="absolute left-0 top-full z-20 mt-2 w-72 overflow-hidden rounded-xl border-2 border-ink bg-card shadow-block">
                <p className="border-b-2 border-line bg-paper px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
                  Choose your campus
                </p>
                {CAMPUSES.map((c) => (
                  <button
                    key={c}
                    onClick={() => { onCampus(c); setCampusOpen(false); notify(`Campus set to ${c}`); }}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-gold/20 ${c === campus ? "bg-gold/10" : ""}`}
                  >
                    <span>{c}</span>
                    {c === campus && <Check className="h-4 w-4 text-pine" />}
                  </button>
                ))}
                <button
                  onClick={() => { setCampusOpen(false); notify("Campus onboarding: 47 universities live — request yours in Settings"); }}
                  className="w-full border-t-2 border-line px-4 py-2 text-left font-mono text-[10px] text-ink-soft transition-colors hover:bg-gold/15 hover:text-ink"
                >
                  47 campuses onboard this semester →
                </button>
              </div>
            </>
          )}
        </div>

        {/* Search */}
        <form
          className="relative ml-auto hidden w-full max-w-xs items-center sm:flex"
          onSubmit={(e) => { e.preventDefault(); onNav("feed"); }}
        >
          <SearchIcon className="pointer-events-none absolute left-3 h-4 w-4 text-ink-soft" />
          <input
            value={query}
            onChange={(e) => { onQuery(e.target.value); }}
            onFocus={() => onNav("feed")}
            placeholder="Search stories, writers, topics…"
            className="w-full rounded-lg border-2 border-ink bg-card py-2 pl-9 pr-8 text-sm placeholder:text-ink-soft/70 focus:bg-white focus:shadow-block-sm"
          />
          {query && (
            <button type="button" onClick={() => onQuery("")} className="absolute right-2 text-ink-soft hover:text-ink" aria-label="Clear search">
              <CloseIcon className="h-4 w-4" />
            </button>
          )}
        </form>

        {/* Notifications */}
        <div className="relative ml-auto sm:ml-0">
          <button
            onClick={() => setBellOpen((o) => !o)}
            className="relative grid h-10 w-10 place-items-center rounded-lg border-2 border-ink bg-card transition-all hover:-translate-y-0.5 hover:shadow-block-sm"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unread > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full border-2 border-paper bg-rasp px-1 font-mono text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </button>
          {bellOpen && (
            <>
              <button className="fixed inset-0 z-10 cursor-default" aria-label="Close" onClick={() => setBellOpen(false)} />
              <div className="absolute right-0 top-full z-20 mt-2 w-[min(92vw,380px)] overflow-hidden rounded-xl border-2 border-ink bg-card shadow-block">
                <div className="flex items-center justify-between border-b-2 border-line bg-paper px-4 py-2.5">
                  <p className="font-display text-sm font-bold">Notifications</p>
                  <button
                    onClick={() => setNotifs((ns) => ns.map((n) => ({ ...n, unread: false })))}
                    className="font-mono text-[10px] font-semibold uppercase tracking-wider text-pine hover:underline"
                  >
                    Mark all read
                  </button>
                </div>
                <ul className="max-h-80 overflow-y-auto thin-scroll">
                  {notifs.map((n) => (
                    <li key={n.id} className="border-b border-line/70">
                      <button
                        onClick={() => setNotifs((ns) => ns.map((x) => (x.id === n.id ? { ...x, unread: false } : x)))}
                        className="flex w-full gap-3 px-4 py-3 text-left text-sm leading-snug transition-colors hover:bg-gold/10"
                      >
                        <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.unread ? "bg-gold" : "bg-line"}`} />
                        <span className="flex-1">
                          {n.text}
                          <span className="ml-2 font-mono text-[10px] text-ink-soft">{n.time}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Profile */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => setUserOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg border-2 border-ink bg-pine py-1 pl-1 pr-3 text-paper transition-all hover:-translate-y-0.5 hover:shadow-block-gold"
            aria-label="Open account menu"
          >
            <span
              className="grid h-8 w-8 place-items-center rounded-md border-2 border-ink font-display text-sm font-extrabold text-paper"
              style={{ backgroundColor: me.color }}
            >
              {me.initials}
            </span>
            <span className="text-sm font-semibold leading-tight">
              {me.name.split(" ")[0]}
              <span className="block font-mono text-[9px] font-medium uppercase tracking-wider text-paper/70">
                {fmt(me.followers)} followers
              </span>
            </span>
          </button>
          {userOpen && (
            <>
              <button className="fixed inset-0 z-10 cursor-default" aria-label="Close" onClick={() => setUserOpen(false)} />
              <div className="absolute right-0 top-full z-20 mt-2 w-64 overflow-hidden rounded-xl border-2 border-ink bg-card shadow-block">
                <div className="border-b-2 border-line bg-paper px-4 py-3">
                  <p className="flex items-center gap-1.5 font-display text-sm font-bold">
                    {me.name} {me.verified && <BadgeCheck className="h-4 w-4 text-cobalt" />}
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-soft">
                    {me.level} · {me.dept}
                  </p>
                  <p className="mt-0.5 truncate font-mono text-[10px] text-ink-soft">{me.bio}</p>
                </div>
                <button
                  onClick={() => { setUserOpen(false); onNav("studio"); }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-semibold transition-colors hover:bg-gold/15"
                >
                  <Studio className="h-4 w-4 text-pine" /> Creator Studio
                </button>
                <button
                  onClick={() => { setUserOpen(false); onLogout(); }}
                  className="flex w-full items-center gap-2 border-t border-line/70 px-4 py-2.5 text-left text-sm font-semibold text-rasp transition-colors hover:bg-rasp/10"
                >
                  <LogOut className="h-4 w-4" /> Log out
                </button>
              </div>
            </>
          )}
        </div>

        {/* Write */}
        <button
          onClick={onWrite}
          className="flex items-center gap-2 rounded-lg border-2 border-ink bg-gold px-3 py-2 font-display text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-block active:translate-y-0 active:shadow-none sm:px-4"
        >
          <Pen className="h-4 w-4" />
          <span className="hidden sm:inline">Write</span>
        </button>
      </div>
    </header>
  );
}

/* ---------------- Campus wire ticker ---------------- */

export function Ticker() {
  const items = [...tickerItems, ...tickerItems];
  return (
    <div className="ticker flex items-stretch overflow-hidden border-b-2 border-ink bg-ink text-paper">
      <div className="z-10 flex shrink-0 items-center gap-1.5 bg-gold px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink lg:px-4">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rasp" />
        Campus Wire
      </div>
      <div className="relative flex-1 overflow-hidden">
        <div className="ticker-track items-center gap-8 py-1.5 pl-8">
          {items.map((t, i) => (
            <span key={i} className="flex shrink-0 items-center gap-8 font-mono text-[11px] uppercase tracking-wider text-paper/90">
              {t}
              <svg className="h-3 w-3 text-gold" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z" /></svg>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Sidebar ---------------- */

export function Sidebar({
  view, onNav, onWrite, verified, onVerify,
}: {
  view: View;
  onNav: (v: View) => void;
  onWrite: () => void;
  verified: boolean;
  onVerify: () => void;
}) {
  return (
    <aside className="sticky top-20 hidden h-fit flex-col gap-5 lg:flex">
      <button
        onClick={onWrite}
        className="group flex items-center justify-center gap-2 rounded-xl border-2 border-ink bg-gold px-4 py-3.5 font-display text-base font-bold shadow-block transition-all hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_var(--color-ink)] active:translate-y-0 active:shadow-block-sm"
      >
        <Pen className="h-5 w-5 transition-transform group-hover:-rotate-12" />
        Write a story
      </button>

      <nav className="overflow-hidden rounded-xl border-2 border-ink bg-card">
        <p className="border-b-2 border-line bg-paper px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
          Navigate
        </p>
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = view === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold transition-all duration-200 ${
                active
                  ? "bg-ink text-paper"
                  : "hover:translate-x-1 hover:bg-gold/15"
              }`}
            >
              <Icon className={`h-[18px] w-[18px] ${active ? "text-gold" : "text-pine"}`} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className={`rounded-md border px-1.5 py-0.5 font-mono text-[9px] font-bold ${active ? "border-gold text-gold" : "border-ink/30 text-ink-soft"}`}>
                  {item.badge}
                </span>
              )}
              {active && <span className="h-2 w-2 rotate-45 bg-gold" />}
            </button>
          );
        })}
      </nav>

      {/* Reputation card */}
      <div className="relative overflow-hidden rounded-xl border-2 border-ink bg-pine p-4 text-paper shadow-block">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{ backgroundImage: "radial-gradient(var(--color-gold) 1.2px, transparent 1.2px)", backgroundSize: "14px 14px" }}
        />
        <div className="relative">
          <p className="flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
            <Trophy className="h-3.5 w-3.5" /> Your reputation
          </p>
          <p className="mt-1.5 font-display text-lg font-bold leading-tight">Campus Contributor</p>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full border border-paper/30 bg-ink/40">
            <div className="h-full rounded-full bg-gold" style={{ width: "68%" }} />
          </div>
          <p className="mt-1.5 font-mono text-[10px] text-paper/75">680 / 1,000 pts → Top Voice</p>
          {verified ? (
            <p className="mt-3 inline-flex rotate-[-2deg] items-center gap-1.5 rounded-md border-2 border-dashed border-gold/80 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-gold">
              <BadgeCheck className="h-3.5 w-3.5" /> Verified student
            </p>
          ) : (
            <button
              onClick={onVerify}
              className="mt-3 inline-flex rotate-[-2deg] items-center gap-1.5 rounded-md border-2 border-gold bg-gold px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-ink transition-all hover:-translate-y-0.5 hover:shadow-block-gold active:translate-y-0"
            >
              <BadgeCheck className="h-3.5 w-3.5" /> Verify student ID
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

/* ---------------- Mobile nav ---------------- */

export function MobileNav({ view, onNav, onWrite }: { view: View; onNav: (v: View) => void; onWrite: () => void }) {
  return (
    <div className="thin-scroll sticky top-16 z-30 flex gap-2 overflow-x-auto border-b-2 border-ink bg-paper px-4 py-2 lg:hidden">
      {NAV.map((item) => {
        const Icon = item.icon;
        const active = view === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNav(item.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-lg border-2 px-3 py-1.5 text-xs font-bold transition-colors ${
              active ? "border-ink bg-ink text-paper" : "border-ink bg-card"
            }`}
          >
            <Icon className={`h-3.5 w-3.5 ${active ? "text-gold" : "text-pine"}`} />
            {item.label}
          </button>
        );
      })}
      <button
        onClick={onWrite}
        className="flex shrink-0 items-center gap-1.5 rounded-lg border-2 border-ink bg-gold px-3 py-1.5 text-xs font-bold"
      >
        <Pen className="h-3.5 w-3.5" /> Write
      </button>
    </div>
  );
}
