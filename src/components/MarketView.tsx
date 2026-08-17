import { useEffect, useRef, useState } from "react";
import { fmtGHS, listings, services } from "../data";
import type { Listing, Service } from "../data";
import { resolveImg } from "../lib/images";
import { ModalShell } from "./Modals";
import { Chat, Check, MapPin, Send, Star, Store } from "./icons";

interface Msg {
  from: "me" | "seller";
  text: string;
}

const SELLER_REPLIES = [
  "Hey! Yes, still available 👍",
  "Sure — when do you want to meet?",
  "I can do campus delivery for a small fee.",
  "It's in great condition, barely used.",
  "Price is slightly negotiable for fellow students.",
];

export function MarketView({ notify }: { notify: (msg: string) => void }) {
  const [tab, setTab] = useState<"listings" | "services">("listings");

  /* ----- chat state ----- */
  const [chatFor, setChatFor] = useState<Listing | null>(null);
  const [threads, setThreads] = useState<Record<string, Msg[]>>({});
  const [chatDraft, setChatDraft] = useState("");
  const [sellerTyping, setSellerTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  /* ----- hire state ----- */
  const [hireFor, setHireFor] = useState<Service | null>(null);
  const [hireDay, setHireDay] = useState("");
  const [hireNote, setHireNote] = useState("");
  const [booked, setBooked] = useState<Set<string>>(new Set());

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [threads, chatFor, sellerTyping]);

  const openChat = (l: Listing) => {
    setChatFor(l);
    setSellerTyping(false);
    if (!threads[l.id]) {
      setThreads((t) => ({
        ...t,
        [l.id]: [{ from: "seller", text: `Hi! I'm ${l.seller}. Ask me anything about the ${l.title.split("·")[0].trim()}.` }],
      }));
    }
  };

  const sendChat = () => {
    if (!chatFor || !chatDraft.trim()) return;
    const id = chatFor.id;
    const text = chatDraft.trim();
    setChatDraft("");
    setThreads((t) => ({ ...t, [id]: [...(t[id] ?? []), { from: "me", text }] }));
    setSellerTyping(true);
    window.setTimeout(() => {
      setSellerTyping(false);
      setThreads((t) => ({
        ...t,
        [id]: [...(t[id] ?? []), { from: "seller", text: SELLER_REPLIES[(t[id]?.length ?? 0) % SELLER_REPLIES.length] }],
      }));
    }, 1100);
  };

  const confirmHire = () => {
    if (!hireFor || !hireDay) return;
    setBooked((b) => new Set(b).add(hireFor.id));
    notify(`Booked ${hireFor.title.split(" ").slice(0, 2).join(" ")} for ${hireDay} — confirmation sent`);
    setHireFor(null);
    setHireDay("");
    setHireNote("");
  };

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
                      onClick={() => openChat(l)}
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
          {services.map((s, i) => {
            const isBooked = booked.has(s.id);
            return (
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
                  onClick={() => { setHireFor(s); setHireDay(""); setHireNote(""); }}
                  disabled={isBooked}
                  className={`flex items-center justify-center gap-1.5 rounded-lg border-2 px-4 py-2 font-display text-sm font-bold transition-all active:translate-y-0 ${
                    isBooked
                      ? "cursor-default border-ink bg-pine text-paper"
                      : "border-ink bg-gold hover:-translate-y-0.5 hover:shadow-block-sm"
                  }`}
                >
                  {isBooked ? (<><Check className="h-4 w-4" /> Booked</>) : "Hire"}
                </button>
              </article>
            );
          })}
        </div>
      )}

      <p className="mt-6 rounded-xl border-2 border-dashed border-ink/35 bg-card/70 px-4 py-3 text-center font-mono text-[11px] uppercase tracking-wider text-ink-soft">
        Selling something? Post a listing from the Write button — pick Marketplace as your format.
      </p>

      {/* Chat modal */}
      {chatFor && (
        <ModalShell title={`Chat with ${chatFor.seller}`} kicker={`Re: ${chatFor.title}`} onClose={() => setChatFor(null)} wide>
          <div className="flex h-64 flex-col gap-2.5 overflow-y-auto thin-scroll rounded-lg border-2 border-ink bg-paper/70 p-3">
            {(threads[chatFor.id] ?? []).map((m, i) => (
              <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                <p
                  className={`max-w-[80%] rounded-xl border-2 px-3 py-2 text-sm leading-relaxed ${
                    m.from === "me"
                      ? "rounded-br-sm border-ink bg-pine text-paper"
                      : "rounded-bl-sm border-ink/40 bg-card text-ink"
                  }`}
                >
                  {m.text}
                </p>
              </div>
            ))}
            {sellerTyping && (
              <div className="flex justify-start">
                <p className="rounded-xl rounded-bl-sm border-2 border-ink/40 bg-card px-3 py-2 text-sm text-ink-soft">
                  {chatFor.seller} is typing<span className="blink">…</span>
                </p>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="mt-3 flex gap-2">
            <input
              value={chatDraft}
              onChange={(e) => setChatDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendChat()}
              placeholder={`Message ${chatFor.seller}…`}
              className="min-w-0 flex-1 rounded-lg border-2 border-ink bg-card px-3.5 py-2.5 text-sm focus:bg-white focus:shadow-block-sm"
            />
            <button
              onClick={sendChat}
              disabled={!chatDraft.trim()}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border-2 border-ink bg-gold transition-all enabled:hover:-translate-y-0.5 enabled:hover:shadow-block-sm disabled:opacity-40"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </ModalShell>
      )}

      {/* Hire modal */}
      {hireFor && (
        <ModalShell title={hireFor.title} kicker={`Hire ${hireFor.seller.split(" · ")[0]} · ${hireFor.price}`} onClose={() => setHireFor(null)}>
          <p className="text-sm leading-relaxed text-ink-soft">
            Pick a day that works. {hireFor.seller.split(" · ")[0]} will confirm within a few hours and you only pay after the job is done.
          </p>
          <p className="mt-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ink-soft">Choose a day</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {["This Friday", "Saturday", "Sunday"].map((d) => (
              <button
                key={d}
                onClick={() => setHireDay(d)}
                className={`rounded-lg border-2 px-3 py-2.5 text-sm font-bold transition-all ${
                  hireDay === d ? "border-ink bg-gold shadow-block-sm" : "border-ink/25 bg-card hover:border-ink"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <textarea
            value={hireNote}
            onChange={(e) => setHireNote(e.target.value)}
            rows={2}
            placeholder="Describe what you need (optional)…"
            className="mt-3 w-full resize-none rounded-lg border-2 border-ink bg-card px-3.5 py-2.5 text-sm focus:bg-white focus:shadow-block-sm"
          />
          <button
            onClick={confirmHire}
            disabled={!hireDay}
            className={`mt-4 w-full rounded-lg border-2 px-4 py-2.5 font-display text-sm font-bold transition-all ${
              hireDay
                ? "border-ink bg-gold shadow-block hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--color-ink)] active:translate-y-0 active:shadow-block-sm"
                : "cursor-not-allowed border-ink/25 bg-card text-ink-soft"
            }`}
          >
            {hireDay ? `Request booking for ${hireDay}` : "Pick a day to continue"}
          </button>
        </ModalShell>
      )}
    </div>
  );
}
