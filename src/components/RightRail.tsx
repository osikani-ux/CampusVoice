import { useState } from "react";
import { events, fmt, pulsePoll as initialPulse, trendingTopics, writers } from "../data";
import type { Poll } from "../data";
import { BadgeCheck, Calendar, Flame, Spark } from "./icons";
import { PollBlock } from "./FeedCard";

export function RightRail({
  rsvps, onRsvp, follows, onFollow, onTopic, notify,
}: {
  rsvps: Set<string>;
  onRsvp: (id: string) => void;
  follows: Set<string>;
  onFollow: (id: string) => void;
  onTopic: (tag: string) => void;
  notify: (msg: string) => void;
}) {
  const [pulse, setPulse] = useState<Poll>(initialPulse);
  const max = Math.max(...pulse.options.map((o) => o.votes));
  const pulseTotal = pulse.options.reduce((s, o) => s + o.votes, 0);

  return (
    <aside className="sticky top-20 hidden h-fit flex-col gap-5 xl:flex">
      {/* Campus pulse */}
      <section className="overflow-hidden rounded-xl border-2 border-ink bg-card shadow-block-sm">
        <header className="flex items-center justify-between border-b-2 border-ink bg-sun px-4 py-2.5">
          <p className="flex items-center gap-1.5 font-display text-sm font-extrabold">
            <Spark className="h-4 w-4" /> Campus Pulse
          </p>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
            {fmt(pulseTotal)} votes
          </span>
        </header>
        <div className="p-4">
          <PollBlock
            poll={pulse}
            compact
            onVote={(i) => {
              setPulse((p) => ({
                ...p,
                voted: i,
                options: p.options.map((o, j) => (j === i ? { ...o, votes: o.votes + 1 } : o)),
              }));
              notify("Vote counted in Campus Pulse");
            }}
          />
          {pulse.voted !== null && (
            <p className="mt-2 text-xs leading-relaxed text-ink-soft">
              Leading: <strong className="text-ink">{pulse.options.find((o) => o.votes === max)?.label}</strong> — results go to the Dean's town-hall deck.
            </p>
          )}
        </div>
      </section>

      {/* This week */}
      <section className="overflow-hidden rounded-xl border-2 border-ink bg-card shadow-block-sm">
        <header className="flex items-center justify-between border-b-2 border-ink bg-pine px-4 py-2.5 text-paper">
          <p className="flex items-center gap-1.5 font-display text-sm font-extrabold">
            <Calendar className="h-4 w-4 text-gold" /> This week
          </p>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-paper/70">September</span>
        </header>
        <ul>
          {events.slice(0, 3).map((e) => {
            const going = rsvps.has(e.id);
            return (
              <li key={e.id} className="flex items-center gap-3 border-b border-line/70 px-4 py-3 transition-colors last:border-0 hover:bg-gold/10">
                <span
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border-2 border-ink text-center leading-none text-paper"
                  style={{ backgroundColor: e.color }}
                >
                  <span>
                    <span className="block font-display text-base font-extrabold">{e.day}</span>
                    <span className="block font-mono text-[8px] font-bold tracking-widest">{e.month}</span>
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold">{e.title}</span>
                  <span className="block font-mono text-[10px] text-ink-soft">
                    {e.venue} · {fmt(e.going + (going ? 1 : 0))} going
                  </span>
                </span>
                <button
                  onClick={() => onRsvp(e.id)}
                  className={`shrink-0 rounded-md border-2 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wide transition-all hover:-translate-y-0.5 active:translate-y-0 ${
                    going ? "border-ink bg-pine text-paper" : "border-ink/25 hover:border-ink hover:bg-gold/25"
                  }`}
                >
                  {going ? "Going ✓" : "RSVP"}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Trending topics */}
      <section className="overflow-hidden rounded-xl border-2 border-ink bg-card shadow-block-sm">
        <header className="flex items-center gap-1.5 border-b-2 border-ink bg-rasp px-4 py-2.5 text-paper">
          <Flame className="h-4 w-4 text-gold" />
          <p className="font-display text-sm font-extrabold">Trending on campus</p>
        </header>
        <ul>
          {trendingTopics.map((t, i) => (
            <li key={t.tag} className="border-b border-line/70 last:border-0">
              <button
                onClick={() => onTopic(t.tag)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-all hover:bg-gold/15 hover:pl-5"
              >
                <span className="font-mono text-xs font-bold text-line">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 font-display text-sm font-bold">{t.tag}</span>
                <span className="font-mono text-[10px] text-ink-soft">{t.posts} posts</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Voices to follow */}
      <section className="overflow-hidden rounded-xl border-2 border-ink bg-card shadow-block-sm">
        <header className="border-b-2 border-ink bg-paper px-4 py-2.5">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
            Voices to follow
          </p>
        </header>
        <ul>
          {writers.slice(0, 3).map((w) => {
            const following = follows.has(w.id);
            return (
              <li key={w.id} className="flex items-center gap-3 border-b border-line/70 px-4 py-3 last:border-0">
                <span
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border-2 border-ink font-display text-xs font-extrabold text-paper"
                  style={{ backgroundColor: w.color }}
                >
                  {w.initials}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1 text-sm font-bold">
                    {w.name} {w.verified && <BadgeCheck className="h-3.5 w-3.5 text-cobalt" />}
                  </span>
                  <span className="block font-mono text-[10px] text-ink-soft">
                    {fmt(w.followers + (following ? 1 : 0))} followers
                  </span>
                </span>
                <button
                  onClick={() => onFollow(w.id)}
                  className={`shrink-0 rounded-md border-2 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wide transition-all hover:-translate-y-0.5 active:translate-y-0 ${
                    following ? "border-ink bg-ink text-paper" : "border-ink bg-gold hover:shadow-block-sm"
                  }`}
                >
                  {following ? "Following" : "Follow"}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <p className="px-2 text-center font-mono text-[10px] leading-relaxed text-ink-soft">
        Made by students, for students.
        <br />
        HCU chapter · est. 2026
      </p>
    </aside>
  );
}
