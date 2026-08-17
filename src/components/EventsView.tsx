import { useState } from "react";
import { events, fmt } from "../data";
import { resolveImg } from "../lib/images";
import { Calendar, MapPin, Clock, Users } from "./icons";

const TAGS = ["All", "Social", "Sports", "Career", "Culture"] as const;
type Tag = (typeof TAGS)[number];

export function EventsView({
  rsvps, onRsvp, notify,
}: {
  rsvps: Set<string>;
  onRsvp: (id: string) => void;
  notify: (msg: string) => void;
}) {
  const [tag, setTag] = useState<Tag>("All");
  const visible = events.filter((e) => tag === "All" || e.tag === tag);

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-pine">
            <Calendar className="h-4 w-4" /> September on campus
          </p>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Don't hear about it <span className="bg-gold px-2 shadow-block-sm">after.</span>
          </h1>
        </div>
        <p className="max-w-xs text-sm leading-relaxed text-ink-soft">
          RSVP to lock your spot. Organisers see live counts — the bigger the number, the bigger the venue next time.
        </p>
      </header>

      <div className="mt-5 flex flex-wrap gap-2">
        {TAGS.map((t) => (
          <button
            key={t}
            onClick={() => setTag(t)}
            className={`rounded-lg border-2 px-3.5 py-1.5 text-sm font-bold transition-all hover:-translate-y-0.5 ${
              tag === t ? "border-ink bg-ink text-gold shadow-block-gold" : "border-ink/30 bg-card hover:border-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {visible.map((e, i) => {
          const going = rsvps.has(e.id);
          const img = resolveImg(e.image);
          return (
            <article
              key={e.id}
              className="reveal group overflow-hidden rounded-xl border-2 border-ink bg-card shadow-block-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-block"
              style={{ transitionDelay: `${Math.min(i, 4) * 60}ms` }}
            >
              {img ? (
                <div className="relative overflow-hidden border-b-2 border-ink">
                  <img src={img} alt={e.title} loading="lazy" className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                  <span
                    className="absolute left-3 top-3 rotate-[-3deg] rounded-md border-2 border-ink px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-paper"
                    style={{ backgroundColor: e.color }}
                  >
                    {e.tag}
                  </span>
                </div>
              ) : (
                <div className="relative overflow-hidden border-b-2 border-ink" style={{ backgroundColor: e.color }}>
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.15]"
                    style={{ backgroundImage: "radial-gradient(var(--color-paper) 1.3px, transparent 1.3px)", backgroundSize: "15px 15px" }}
                  />
                  <div className="flex h-40 items-center justify-between px-5">
                    <span className="font-display text-5xl font-extrabold text-paper drop-shadow-[3px_3px_0_rgba(16,34,26,0.5)]">
                      {e.day}
                    </span>
                    <span className="rotate-[-3deg] rounded-md border-2 border-paper/70 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-paper">
                      {e.tag}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-5">
                <div className="flex items-start gap-3">
                  <span
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border-2 border-ink text-center leading-none text-paper shadow-block-sm"
                    style={{ backgroundColor: e.color }}
                  >
                    <span>
                      <span className="block font-display text-lg font-extrabold">{e.day}</span>
                      <span className="block font-mono text-[8px] font-bold tracking-widest">{e.month}</span>
                    </span>
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-display text-xl font-extrabold leading-tight">{e.title}</h2>
                    <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-ink-soft">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{e.time}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{e.venue}</span>
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{fmt(e.going + (going ? 1 : 0))} going</span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => onRsvp(e.id)}
                    className={`flex-1 rounded-lg border-2 px-4 py-2.5 font-display text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-block-sm active:translate-y-0 ${
                      going ? "border-ink bg-pine text-paper" : "border-ink bg-gold"
                    }`}
                  >
                    {going ? "You're going ✓" : "RSVP — I'm in"}
                  </button>
                  <button
                    onClick={() => notify(`${e.title} added to your calendar`)}
                    className="rounded-lg border-2 border-ink/25 px-3.5 py-2.5 text-sm font-bold transition-all hover:-translate-y-0.5 hover:border-ink hover:shadow-block-sm active:translate-y-0"
                  >
                    + Calendar
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
