import { useState } from "react";
import { fmtGHS, listings, services } from "../data";
import { resolveImg } from "../lib/images";
import { Chat, MapPin, Star, Store } from "./icons";

export function MarketView({ notify }: { notify: (msg: string) => void }) {
  const [tab, setTab] = useState<"listings" | "services">("listings");

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-pine">
            <Store className="h-4 w-4" /> The student economy
          </p>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Buy, sell & hire <span className="bg-gold px-2 shadow-block-sm">on campus.</span>
          </h1>
        </div>
        <div className="flex overflow-hidden rounded-lg border-2 border-ink bg-card shadow-block-sm">
          <button
            onClick={() => setTab("listings")}
            className={`px-4 py-2 font-display text-sm font-bold transition-colors ${tab === "listings" ? "bg-ink text-gold" : "hover:bg-gold/20"}`}
          >
            Listings
          </button>
          <button
            onClick={() => setTab("services")}
            className={`px-4 py-2 font-display text-sm font-bold transition-colors ${tab === "services" ? "bg-ink text-gold" : "hover:bg-gold/20"}`}
          >
            Student services
          </button>
        </div>
      </header>

      {tab === "listings" ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {listings.map((l, i) => {
            const img = resolveImg(l.image);
            return (
              <article
                key={l.id}
                className="reveal group overflow-hidden rounded-xl border-2 border-ink bg-card shadow-block-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-block"
                style={{ transitionDelay: `${Math.min(i, 5) * 55}ms` }}
              >
                <div className="relative overflow-hidden border-b-2 border-ink">
                  {img ? (
                    <img src={img} alt={l.title} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                  ) : (
                    <div className="relative flex aspect-[4/3] items-center justify-center" style={{ backgroundColor: l.cover?.bg ?? "#14603f" }}>
                      <div
                        className="pointer-events-none absolute inset-0 opacity-[0.15]"
                        style={{ backgroundImage: "radial-gradient(var(--color-paper) 1.3px, transparent 1.3px)", backgroundSize: "15px 15px" }}
                      />
                      <span className="font-display text-4xl font-extrabold text-paper drop-shadow-[3px_3px_0_rgba(16,34,26,0.5)]">
                        {l.cover?.big}
                      </span>
                    </div>
                  )}
                  <span className="absolute left-3 top-3 rotate-[-3deg] rounded-md border-2 border-ink bg-paper px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider">
                    {l.tag}
                  </span>
                </div>
                <div className="p-4">
                  <h2 className="font-display text-base font-extrabold leading-snug">{l.title}</h2>
                  <p className="mt-1 font-display text-xl font-extrabold text-pine">{fmtGHS(l.price)}</p>
                  <div className="mt-2.5 flex items-center justify-between gap-2 border-t-2 border-line pt-2.5">
                    <p className="font-mono text-[11px] leading-tight text-ink-soft">
                      {l.seller} · {l.level}
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{l.location}</span>
                    </p>
                    <button
                      onClick={() => notify(`Message sent to ${l.seller} — they reply fast`)}
                      className="flex shrink-0 items-center gap-1.5 rounded-lg border-2 border-ink bg-gold px-3 py-1.5 text-xs font-bold transition-all hover:-translate-y-0.5 hover:shadow-block-sm active:translate-y-0"
                    >
                      <Chat className="h-3.5 w-3.5" /> Message
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {services.map((s, i) => (
            <article
              key={s.id}
              className="reveal flex flex-col gap-3 rounded-xl border-2 border-ink bg-card p-4 shadow-block-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-block sm:flex-row sm:items-center"
              style={{ transitionDelay: `${Math.min(i, 5) * 50}ms` }}
            >
              <span
                className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border-2 border-ink font-display text-lg font-extrabold text-paper shadow-block-sm"
                style={{ backgroundColor: s.color }}
              >
                {s.title[0]}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-lg font-extrabold">{s.title}</h2>
                <p className="mt-0.5 font-mono text-[11px] text-ink-soft">
                  {s.seller} · {s.jobs} jobs done
                </p>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className={`h-4 w-4 ${j < Math.round(s.rating) ? "text-gold" : "text-line"}`} filled={j < Math.round(s.rating)} />
                ))}
                <span className="ml-1 font-mono text-[11px] font-bold">{s.rating.toFixed(1)}</span>
              </div>
              <p className="font-display text-lg font-extrabold text-pine sm:ml-2 sm:text-right">{s.price}</p>
              <button
                onClick={() => notify(`Hire request sent to ${s.seller.split(" · ")[0]}`)}
                className="rounded-lg border-2 border-ink bg-gold px-4 py-2 font-display text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-block-sm active:translate-y-0"
              >
                Hire
              </button>
            </article>
          ))}
        </div>
      )}

      <p className="mt-6 rounded-xl border-2 border-dashed border-ink/35 bg-card/70 px-4 py-3 text-center font-mono text-[11px] uppercase tracking-wider text-ink-soft">
        Selling something? Post a listing from the Write button — pick Marketplace as your format.
      </p>
    </div>
  );
}
