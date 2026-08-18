import { useEffect, useRef, useState } from "react";
import { COVER_COLORS, MARKET_TAGS, fmtGHS, services } from "../data";
import type { Listing, Service, Writer } from "../data";
import { resolveImg } from "../lib/images";
import { ModalShell } from "./Modals";
import { Camera, Chat, Check, CloseIcon, MapPin, Pen, Send, Star, Store, TrashIcon } from "./icons";

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

export function MarketView({
  listings, me, onSell, onDelete, notify,
}: {
  listings: Listing[];
  me: Writer;
  onSell: (l: Listing) => void;
  onDelete: (id: string) => void;
  notify: (msg: string) => void;
}) {
  const [tab, setTab] = useState<"listings" | "services">("listings");
  const [sellOpen, setSellOpen] = useState(false);

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
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSellOpen(true)}
            className="group flex items-center gap-2 rounded-lg border-2 border-ink bg-gold px-4 py-2 font-display text-sm font-bold shadow-block-sm transition-all hover:-translate-y-0.5 hover:shadow-block active:translate-y-0 active:shadow-none"
          >
            <Pen className="h-4 w-4 transition-transform group-hover:-rotate-12" />
            Sell something
          </button>
          <div className="flex overflow-hidden rounded-lg border-2 border-ink bg-card shadow-block-sm">
            <button
              onClick={() => setTab("listings")}
              className={`px-4 py-2 font-display text-sm font-bold transition-colors ${tab === "listings" ? "bg-ink text-gold" : "hover:bg-gold/20"}`}
            >
              Listings ({listings.length})
            </button>
            <button
              onClick={() => setTab("services")}
              className={`px-4 py-2 font-display text-sm font-bold transition-colors ${tab === "services" ? "bg-ink text-gold" : "hover:bg-gold/20"}`}
            >
              Student services
            </button>
          </div>
        </div>
      </header>

      {tab === "listings" ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {/* The ready-to-post card — always first */}
          <button
            onClick={() => setSellOpen(true)}
            className="reveal group overflow-hidden rounded-xl border-2 border-dashed border-ink/50 bg-card/60 text-left transition-all duration-200 hover:-translate-y-1 hover:border-ink hover:bg-card hover:shadow-block"
            style={{ transitionDelay: "0ms" }}
          >
            <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b-2 border-dashed border-ink/40 bg-paper">
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.35]"
                style={{ backgroundImage: "radial-gradient(var(--color-line) 1.3px, transparent 1.3px)", backgroundSize: "15px 15px" }}
              />
              <span className="relative grid h-14 w-14 place-items-center rounded-xl border-2 border-ink bg-gold shadow-block-sm transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110">
                <Pen className="h-6 w-6" />
              </span>
              <span className="absolute left-3 top-3 rotate-[-3deg] rounded-md border-2 border-ink bg-ink px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-gold">
                Your ad here
              </span>
            </div>
            <div className="p-4">
              <h2 className="font-display text-base font-extrabold leading-snug">
                Sell something to your campus
              </h2>
              <p className="mt-1 font-display text-xl font-extrabold text-ink-soft/60">GHS —</p>
              <div className="mt-2.5 flex items-center justify-between gap-2 border-t-2 border-line pt-2.5">
                <p className="font-mono text-[11px] text-ink-soft">
                  {me.name} · {me.level}
                </p>
                <span className="flex items-center gap-1.5 rounded-lg border-2 border-ink bg-gold px-3 py-1.5 text-xs font-bold transition-all group-hover:-translate-y-0.5 group-hover:shadow-block-sm">
                  <Pen className="h-3.5 w-3.5" /> Post a listing
                </span>
              </div>
            </div>
          </button>

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
                  <span className={`absolute left-3 top-3 rotate-[-3deg] rounded-md border-2 border-ink px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${l.mine ? "bg-gold" : "bg-paper"}`}>
                    {l.tag}
                  </span>
                  {l.mine && (
                    <span className="absolute right-3 top-3 rotate-[3deg] rounded-md border-2 border-ink bg-pine px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-paper">
                      Your listing
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="font-display text-base font-extrabold leading-snug">{l.title}</h2>
                  {l.desc && <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">{l.desc}</p>}
                  <p className="mt-1 font-display text-xl font-extrabold text-pine">{fmtGHS(l.price)}</p>
                  <div className="mt-2.5 flex items-center justify-between gap-2 border-t-2 border-line pt-2.5">
                    <p className="font-mono text-[11px] leading-tight text-ink-soft">
                      {l.seller} · {l.level}
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{l.location}</span>
                    </p>
                    {l.mine ? (
                      <button
                        onClick={() => onDelete(l.id)}
                        className="flex shrink-0 items-center gap-1.5 rounded-lg border-2 border-rasp/60 bg-rasp/10 px-3 py-1.5 text-xs font-bold text-rasp transition-all hover:-translate-y-0.5 hover:border-rasp hover:bg-rasp hover:text-white active:translate-y-0"
                      >
                        <TrashIcon className="h-3.5 w-3.5" /> Take down
                      </button>
                    ) : (
                      <button
                        onClick={() => openChat(l)}
                        className="flex shrink-0 items-center gap-1.5 rounded-lg border-2 border-ink bg-gold px-3 py-1.5 text-xs font-bold transition-all hover:-translate-y-0.5 hover:shadow-block-sm active:translate-y-0"
                      >
                        <Chat className="h-3.5 w-3.5" /> Message
                      </button>
                    )}
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
        {listings.filter((l) => l.mine).length > 0
          ? `You have ${listings.filter((l) => l.mine).length} live listing${listings.filter((l) => l.mine).length > 1 ? "s" : ""} — buyers will message you here`
          : "Fees, food, data bundles — one sold item covers a lot. Post your first listing above."}
      </p>

      {sellOpen && (
        <SellModal me={me} onClose={() => setSellOpen(false)} onSell={(l) => { setSellOpen(false); onSell(l); }} />
      )}

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

/* ---------------- Sell / post-a-listing modal ---------------- */

const inputCls =
  "w-full rounded-lg border-2 border-ink bg-card px-3.5 py-2.5 text-sm placeholder:text-ink-soft/50 focus:bg-white focus:shadow-block-sm";

/** Read a file into a data URL. */
const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read the file"));
    reader.readAsDataURL(file);
  });

/** Downscale a data-URL image so previews & the feed stay light. */
const downscale = (dataUrl: string, maxW = 1000): Promise<string> =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxW / img.width);
      if (scale >= 1) return resolve(dataUrl);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(dataUrl);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });

function SellModal({
  me, onClose, onSell,
}: {
  me: Writer;
  onClose: () => void;
  onSell: (l: Listing) => void;
}) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [tag, setTag] = useState(MARKET_TAGS[0]);
  const [location, setLocation] = useState("");
  const [desc, setDesc] = useState("");
  const [color, setColor] = useState(COVER_COLORS[0]);
  const [error, setError] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [photoErr, setPhotoErr] = useState("");
  const [reading, setReading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const big = (title.trim().split(/\s+/)[0] || "ITEM").toUpperCase().slice(0, 6);
  const priceNum = Number(price);
  const valid = title.trim().length >= 4 && Number.isFinite(priceNum) && priceNum >= 1 && location.trim().length >= 2;

  const processFile = async (file: File | undefined | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPhotoErr("That isn't an image — JPG, PNG or WebP work best.");
      return;
    }
    setPhotoErr("");
    setReading(true);
    try {
      const raw = await fileToDataUrl(file);
      setPhoto(await downscale(raw));
    } catch {
      setPhotoErr("Couldn't read that image. Try another one.");
    } finally {
      setReading(false);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const file = Array.from(e.clipboardData.items)
      .map((i) => i.getAsFile())
      .find(Boolean);
    if (file) void processFile(file);
  };

  const submit = () => {
    if (title.trim().length < 4) { setError("Give your item a name (4+ characters)."); return; }
    if (!Number.isFinite(priceNum) || priceNum < 1) { setError("Set a price in GHS — buyers need a number."); return; }
    if (location.trim().length < 2) { setError("Where should buyers meet you? (e.g. Hall 3)"); return; }
    onSell({
      id: `m${Date.now()}`,
      title: title.trim(),
      price: Math.round(priceNum),
      seller: me.name.split(" ")[0],
      level: me.level,
      location: location.trim(),
      cover: { bg: color, big },
      tag,
      desc: desc.trim() || undefined,
      image: photo ?? undefined,
      mine: true,
    });
  };

  return (
    <ModalShell title="Post a listing" kicker="CampusVoice Marketplace" onClose={onClose} wide>
      <div className="grid gap-5 md:grid-cols-[1fr_240px]">
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ink-soft">What are you selling?</span>
            <input
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(""); }}
              placeholder="e.g. Samsung Galaxy A34 · barely used"
              className={inputCls}
              maxLength={60}
              autoFocus
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ink-soft">Price (GHS)</span>
              <input
                value={price}
                onChange={(e) => { setPrice(e.target.value.replace(/[^\d.]/g, "")); setError(""); }}
                placeholder="e.g. 1200"
                inputMode="decimal"
                className={inputCls}
              />
            </label>
            <label className="block">
              <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ink-soft">Category</span>
              <select value={tag} onChange={(e) => setTag(e.target.value)} className={inputCls}>
                {MARKET_TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ink-soft">Meet-up spot</span>
            <input
              value={location}
              onChange={(e) => { setLocation(e.target.value); setError(""); }}
              placeholder="e.g. Hall 3 · East gate"
              className={inputCls}
              maxLength={40}
            />
          </label>

          {/* Item photo */}
          <div>
            <span className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ink-soft">
              <Camera className="h-3.5 w-3.5 text-pine" /> Item photo
              <span className="normal-case tracking-normal text-ink-soft/70">— sells 3× faster</span>
            </span>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { void processFile(e.target.files?.[0]); e.target.value = ""; }}
            />
            {photo ? (
              <div className="relative overflow-hidden rounded-lg border-2 border-ink">
                <img src={photo} alt="Item preview" className="aspect-[4/3] w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-ink/80 px-3 py-2">
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="rounded-md border-2 border-paper/40 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-paper transition-colors hover:border-gold hover:text-gold"
                  >
                    Replace
                  </button>
                  <button
                    onClick={() => { setPhoto(null); setPhotoErr(""); }}
                    className="flex items-center gap-1 rounded-md border-2 border-rasp/70 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-rasp transition-colors hover:bg-rasp hover:text-white"
                  >
                    <TrashIcon className="h-3 w-3" /> Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); void processFile(e.dataTransfer.files?.[0]); }}
                onPaste={handlePaste}
                className={`flex w-full flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed px-4 py-7 text-center transition-all ${
                  dragOver
                    ? "border-pine bg-pine/10 shadow-block-sm"
                    : "border-ink/40 bg-card/60 hover:border-ink hover:bg-card"
                }`}
              >
                <span className={`grid h-11 w-11 place-items-center rounded-lg border-2 border-ink transition-all ${dragOver ? "bg-gold" : "bg-paper"}`}>
                  <Camera className="h-5 w-5" />
                </span>
                <span className="font-display text-sm font-bold">
                  {reading ? "Reading photo…" : dragOver ? "Drop it here" : "Add a photo of your item"}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
                  Click to browse · drag & drop · or paste (⌘V)
                </span>
              </button>
            )}
            {photoErr && <p className="mt-1.5 text-xs font-semibold text-rasp">{photoErr}</p>}
          </div>

          <div>
            <span className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ink-soft">
              Cover colour <span className="normal-case tracking-normal text-ink-soft/70">{photo ? "(photo will be shown instead)" : "(used when there's no photo)"}</span>
            </span>
            <div className="flex gap-2">
              {COVER_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`h-9 w-9 rounded-lg border-2 transition-all hover:-translate-y-0.5 ${color === c ? "border-ink shadow-block-sm" : "border-ink/25"}`}
                  style={{ backgroundColor: c }}
                  aria-label={`Cover colour ${c}`}
                >
                  {color === c && <Check className="mx-auto h-4 w-4 text-paper" />}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ink-soft">
              One-line pitch <span className="normal-case tracking-normal text-ink-soft/70">(optional)</span>
            </span>
            <input
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="e.g. Comes with charger and case"
              className={inputCls}
              maxLength={70}
            />
          </label>

          {error && (
            <p className="rounded-lg border-2 border-rasp bg-rasp/10 px-3.5 py-2.5 text-sm font-semibold text-rasp">{error}</p>
          )}

          <div className="flex gap-2 border-t-2 border-line pt-4">
            <button
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 rounded-lg border-2 border-ink bg-card px-4 py-2.5 font-display text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-block-sm active:translate-y-0"
            >
              <CloseIcon className="h-4 w-4" /> Cancel
            </button>
            <button
              onClick={submit}
              disabled={!valid}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 px-4 py-2.5 font-display text-sm font-bold transition-all ${
                valid
                  ? "border-ink bg-gold shadow-block hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_var(--color-ink)] active:translate-y-0 active:shadow-block-sm"
                  : "cursor-not-allowed border-ink/25 bg-card text-ink-soft"
              }`}
            >
              <Store className="h-4 w-4" /> Post to marketplace
            </button>
          </div>
        </div>

        {/* Live preview — the exact card that goes live */}
        <div>
          <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ink-soft">
            Live preview
            <span className="ml-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-moss align-middle" />
          </p>
          <article className="overflow-hidden rounded-xl border-2 border-ink bg-card shadow-block-sm">
            <div
              className="relative flex aspect-[4/3] items-center justify-center overflow-hidden"
              style={photo ? undefined : { backgroundColor: color }}
            >
              {photo ? (
                <img src={photo} alt="" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <>
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.15]"
                    style={{ backgroundImage: "radial-gradient(var(--color-paper) 1.3px, transparent 1.3px)", backgroundSize: "15px 15px" }}
                  />
                  <span className="font-display text-4xl font-extrabold text-paper drop-shadow-[3px_3px_0_rgba(16,34,26,0.5)]">
                    {big}
                  </span>
                </>
              )}
              <span className="absolute left-3 top-3 rotate-[-3deg] rounded-md border-2 border-ink bg-gold px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider">
                {tag}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-display text-base font-extrabold leading-snug">
                {title.trim() || "Your item's title"}
              </h3>
              {desc.trim() && <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">{desc}</p>}
              <p className="mt-1 font-display text-xl font-extrabold text-pine">
                {Number.isFinite(priceNum) && priceNum >= 1 ? fmtGHS(Math.round(priceNum)) : "GHS —"}
              </p>
              <div className="mt-2.5 flex items-center justify-between gap-2 border-t-2 border-line pt-2.5">
                <p className="font-mono text-[11px] leading-tight text-ink-soft">
                  {me.name.split(" ")[0]} · {me.level}
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{location.trim() || "meet-up spot"}</span>
                </p>
                <span className="flex shrink-0 items-center gap-1.5 rounded-lg border-2 border-ink bg-gold px-3 py-1.5 text-xs font-bold">
                  <Chat className="h-3.5 w-3.5" /> Message
                </span>
              </div>
            </div>
          </article>
          <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-wider text-ink-soft">
            This is exactly what buyers see
          </p>
        </div>
      </div>
    </ModalShell>
  );
}
