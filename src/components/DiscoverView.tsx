import { announcements, communities, fmt, writers } from "../data";
import { AnnouncementCard } from "./FeedCard";
import { BadgeCheck, Compass, Trophy, Users } from "./icons";

export function DiscoverView({
  follows, onFollow, joined, onJoin, notify,
}: {
  follows: Set<string>;
  onFollow: (id: string) => void;
  joined: Set<string>;
  onJoin: (id: string) => void;
  notify: (msg: string) => void;
}) {
  return (
    <div className="space-y-10">
      {/* Campus wire */}
      <section>
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-pine">
              <Compass className="h-4 w-4" /> Verified sources only
            </p>
            <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              The campus wire<span className="blink text-pine">_</span>
            </h1>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-ink-soft">
            Official notices from verified campus accounts — SRC, exam office, the university and hall wardens. No rumours, only stamps.
          </p>
        </header>
        <div className="mt-5 grid gap-5">
          {announcements.map((a) => (
            <AnnouncementCard key={a.id} a={a} />
          ))}
        </div>
      </section>

      {/* Writers */}
      <section>
        <header className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-gold" />
          <h2 className="font-display text-2xl font-extrabold tracking-tight">Voices to follow</h2>
        </header>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {writers.map((w, i) => {
            const following = follows.has(w.id);
            return (
              <article
                key={w.id}
                className="reveal group rounded-xl border-2 border-ink bg-card p-4 shadow-block-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-block"
                style={{ transitionDelay: `${Math.min(i, 5) * 55}ms` }}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border-2 border-ink font-display text-base font-extrabold text-paper transition-transform group-hover:-rotate-6"
                    style={{ backgroundColor: w.color }}
                  >
                    {w.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 font-display text-base font-bold">
                      {w.name} {w.verified && <BadgeCheck className="h-4 w-4 text-cobalt" />}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
                      {w.level} · {w.dept}
                    </p>
                  </div>
                </div>
                <p className="mt-3 min-h-[3.5rem] text-sm leading-relaxed text-ink-soft">{w.bio}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {w.badges.map((b) => (
                    <span key={b} className="rounded-md border border-ink/20 bg-paper px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide text-ink-soft">
                      {b}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between border-t-2 border-line pt-3">
                  <p className="font-mono text-[11px] text-ink-soft">
                    <strong className="text-ink">{fmt(w.followers + (following ? 1 : 0))}</strong> followers ·{" "}
                    <strong className="text-ink">{w.articles}</strong> articles
                  </p>
                  <button
                    onClick={() => onFollow(w.id)}
                    className={`rounded-lg border-2 px-3.5 py-1.5 font-display text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-block-sm active:translate-y-0 ${
                      following ? "border-ink bg-ink text-paper" : "border-ink bg-gold"
                    }`}
                  >
                    {following ? "Following ✓" : "Follow"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Communities */}
      <section>
        <header className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gold" />
          <h2 className="font-display text-2xl font-extrabold tracking-tight">Communities</h2>
        </header>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {communities.map((c, i) => {
            const isJoined = joined.has(c.id) || c.joined;
            return (
              <article
                key={c.id}
                className="reveal relative overflow-hidden rounded-xl border-2 border-ink bg-card p-4 shadow-block-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-block"
                style={{ transitionDelay: `${Math.min(i, 5) * 55}ms` }}
              >
                <span
                  className="absolute inset-x-0 top-0 h-1.5"
                  style={{ backgroundColor: c.color }}
                />
                <p className="font-display text-lg font-extrabold leading-tight">{c.name}</p>
                <p className="mt-1.5 min-h-[2.5rem] text-sm leading-relaxed text-ink-soft">{c.desc}</p>
                <div className="mt-3 flex items-center justify-between border-t-2 border-line pt-3">
                  <p className="font-mono text-[11px] text-ink-soft">
                    <strong className="text-ink">{fmt(c.members + (isJoined && !c.joined ? 1 : 0))}</strong> members
                  </p>
                  <button
                    onClick={() => { onJoin(c.id); }}
                    className={`rounded-lg border-2 px-3.5 py-1.5 font-display text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-block-sm active:translate-y-0 ${
                      isJoined ? "border-ink bg-pine text-paper" : "border-ink bg-gold"
                    }`}
                  >
                    {isJoined ? "Joined ✓" : "Join"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
        <p className="mt-4 text-center font-mono text-[11px] uppercase tracking-wider text-ink-soft">
          Running a club or society?{" "}
          <button onClick={() => notify("Community creation opens after student-ID verification")} className="font-bold text-pine underline decoration-gold decoration-2 underline-offset-2">
            Claim your community
          </button>
        </p>
      </section>
    </div>
  );
}
