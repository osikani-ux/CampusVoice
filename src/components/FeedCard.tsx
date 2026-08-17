import { useEffect, useState } from "react";
import { CATEGORY_META, fmt } from "../data";
import type { Announcement, Poll, Post } from "../data";
import { resolveImg } from "../lib/images";
import {
  BadgeCheck, Bookmark, Bulb, Chat, Clock, Heart, MaskIcon,
  Megaphone, Share, Spark,
} from "./icons";

/* ---------------- Poll block ---------------- */

export function PollBlock({
  poll, onVote, compact,
}: {
  poll: Poll;
  onVote: (i: number) => void;
  compact?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const total = poll.options.reduce((s, o) => s + o.votes, 0);

  if (poll.voted === null) {
    return (
      <div className="mt-3 rounded-xl border-2 border-ink bg-paper/70 p-3">
        <p className={`mb-2.5 font-display font-bold ${compact ? "text-sm" : "text-base"}`}>{poll.question}</p>
        <div className="grid gap-2">
          {poll.options.map((o, i) => (
            <button
              key={o.label}
              onClick={() => onVote(i)}
              className="rounded-lg border-2 border-ink/25 bg-card px-3 py-2 text-left text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-ink hover:bg-gold/20 hover:shadow-block-sm active:translate-y-0"
            >
              {o.label}
            </button>
          ))}
        </div>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-ink-soft">
          {fmt(total)} votes · one vote per student
        </p>
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-xl border-2 border-ink bg-paper/70 p-3">
      <p className={`mb-2.5 font-display font-bold ${compact ? "text-sm" : "text-base"}`}>{poll.question}</p>
      <div className="grid gap-2">
        {poll.options.map((o, i) => {
          const pct = Math.round((o.votes / total) * 100);
          const chosen = poll.voted === i;
          return (
            <div key={o.label}>
              <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
                <span className={`font-semibold ${chosen ? "text-pine" : ""}`}>{o.label}</span>
                <span className="font-mono text-[11px] text-ink-soft">{pct}%</span>
              </div>
              <div className="h-5 overflow-hidden rounded-md border-2 border-ink/20 bg-card">
                <div
                  className={`bar-fill h-full rounded-r-sm ${chosen ? "bg-gold" : "bg-pine"}`}
                  style={{ width: mounted ? `${pct}%` : "0%" }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-ink-soft">
        {fmt(total)} students voted · your vote counted ✓
      </p>
    </div>
  );
}

/* ---------------- Announcement card ---------------- */

export function AnnouncementCard({ a }: { a: Announcement }) {
  return (
    <article className="reveal relative overflow-hidden rounded-xl border-2 border-ink bg-ink p-5 text-paper shadow-block">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.1]"
        style={{ backgroundImage: "radial-gradient(var(--color-paper) 1px, transparent 1px)", backgroundSize: "16px 16px" }}
      />
      <p className="stamp-in absolute right-4 top-4 rotate-[-6deg] rounded-md border-2 border-gold px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-gold">
        Verified campus account
      </p>
      <div className="relative">
        <p className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
          <Megaphone className="h-4 w-4" /> Campus announcement · {a.kind}
        </p>
        <div className="mt-3 flex items-start gap-3">
          <span
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border-2 border-paper/25 font-display text-sm font-extrabold"
            style={{ backgroundColor: a.color }}
          >
            {a.initials}
          </span>
          <div>
            <p className="flex items-center gap-1.5 font-display text-base font-bold">
              {a.org} <BadgeCheck className="h-4 w-4 text-gold" />
            </p>
            <p className="mt-1 text-sm leading-relaxed text-paper/90">{a.text}</p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-paper/60">
              {a.time} ago · official notice
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ---------------- Post card ---------------- */

export function FeedCard({
  post, index, onOpen, onLike, onUseful, onSave, onShare, onVote,
}: {
  post: Post;
  index: number;
  onOpen: () => void;
  onLike: () => void;
  onUseful: () => void;
  onSave: () => void;
  onShare: () => void;
  onVote: (i: number) => void;
}) {
  const meta = CATEGORY_META[post.category];
  const img = resolveImg(post.image);

  return (
    <article
      className={`reveal group relative overflow-hidden rounded-xl border-2 bg-card shadow-block-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-block ${
        post.anonymous ? "border-dashed border-ink/60" : "border-ink"
      }`}
      style={{ transitionDelay: `${Math.min(index, 5) * 55}ms` }}
    >
      {/* Sponsored strip */}
      {post.sponsored && (
        <div className="flex items-center gap-2 border-b-2 border-ink bg-gold/30 px-5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft">
          <Spark className="h-3.5 w-3.5 text-gold" /> Sponsored · paid placement
        </div>
      )}

      <div className="p-5">
        {/* Byline */}
        <div className="flex items-start gap-3">
          {post.anonymous ? (
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border-2 border-dashed border-ink/50 bg-paper">
              <MaskIcon className="h-5 w-5 text-ink-soft" />
            </span>
          ) : (
            <button
              onClick={onOpen}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border-2 border-ink font-display text-sm font-extrabold text-paper transition-transform hover:scale-105"
              style={{ backgroundColor: post.author.color }}
              aria-label={post.author.name}
            >
              {post.author.initials}
            </button>
          )}
          <div className="min-w-0 flex-1">
            {post.anonymous ? (
              <p className="font-display text-sm font-bold">
                Anonymous <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-ink-soft">· HCU confessions</span>
              </p>
            ) : (
              <p className="flex flex-wrap items-center gap-x-1.5 font-display text-sm font-bold">
                {post.author.name}
                {post.author.verified && <BadgeCheck className="h-4 w-4 text-cobalt" />}
                <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-ink-soft">
                  {post.author.level} · {post.author.dept}
                </span>
              </p>
            )}
            <p className="mt-0.5 flex items-center gap-1.5 font-mono text-[11px] text-ink-soft">
              <Clock className="h-3 w-3" /> {post.time === "now" ? "just now" : `${post.time} ago`} · {post.readMins} min read
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="hidden rounded-md border-2 border-ink/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider sm:inline-block"
              style={{ backgroundColor: meta.soft, color: meta.color }}
            >
              {post.category}
            </span>
            <button
              onClick={onSave}
              className={`grid h-8 w-8 place-items-center rounded-lg border-2 transition-all hover:-translate-y-0.5 ${
                post.saved ? "border-ink bg-gold shadow-block-sm" : "border-ink/20 hover:border-ink"
              }`}
              aria-label={post.saved ? "Remove from reading list" : "Save to reading list"}
            >
              <Bookmark className="h-4 w-4" filled={post.saved} />
            </button>
          </div>
        </div>

        {/* Title + excerpt */}
        <button onClick={onOpen} className="mt-3 block text-left">
          <h3 className="font-display text-xl font-extrabold leading-snug tracking-tight transition-colors group-hover:text-pine sm:text-2xl">
            {post.title}
          </h3>
        </button>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{post.excerpt}</p>

        {/* Visual */}
        {img && (
          <button onClick={onOpen} className="mt-4 block w-full overflow-hidden rounded-lg border-2 border-ink">
            <img
              src={img}
              alt={post.title}
              loading="lazy"
              className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </button>
        )}
        {!img && post.cover && (
          <button
            onClick={onOpen}
            className="relative mt-4 block w-full overflow-hidden rounded-lg border-2 border-ink text-left"
            style={{ backgroundColor: post.cover.bg }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.16]"
              style={{ backgroundImage: "radial-gradient(var(--color-paper) 1.4px, transparent 1.4px)", backgroundSize: "15px 15px" }}
            />
            <div className="relative flex items-center justify-between gap-4 px-5 py-6">
              <span className="font-display text-3xl font-extrabold tracking-tight text-paper drop-shadow-[3px_3px_0_rgba(16,34,26,0.55)] sm:text-4xl">
                {post.cover.big}
              </span>
              <span className="rotate-[-3deg] rounded-md border-2 border-paper/70 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-paper">
                {post.cover.sub}
              </span>
            </div>
          </button>
        )}

        {/* Poll */}
        {post.poll && <PollBlock poll={post.poll} onVote={onVote} />}

        {/* Actions */}
        <div className="mt-4 flex items-center gap-1.5 border-t-2 border-line pt-3.5">
          <button
            onClick={onLike}
            className={`flex items-center gap-1.5 rounded-lg border-2 px-2.5 py-1.5 text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-block-sm active:translate-y-0 ${
              post.liked ? "border-ink bg-rasp text-white" : "border-ink/20 hover:border-rasp hover:text-rasp"
            }`}
          >
            <span key={post.likes} className={post.liked ? "pop" : ""}>
              <Heart className={`h-4 w-4 ${post.liked ? "burst rounded-full" : ""}`} filled={post.liked} />
            </span>
            <span key={`n${post.likes}`}>{fmt(post.likes)}</span>
          </button>
          <button
            onClick={onUseful}
            className={`flex items-center gap-1.5 rounded-lg border-2 px-2.5 py-1.5 text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-block-sm active:translate-y-0 ${
              post.usefulMarked ? "border-ink bg-gold" : "border-ink/20 hover:border-ink hover:bg-gold/20"
            }`}
            title="Mark as useful"
          >
            <Bulb className="h-4 w-4" filled={post.usefulMarked} />
            <span key={`u${post.useful}`}>{fmt(post.useful)}</span>
            <span className="hidden font-mono text-[10px] font-semibold uppercase tracking-wide text-ink-soft md:inline">
              useful
            </span>
          </button>
          <button
            onClick={onOpen}
            className="flex items-center gap-1.5 rounded-lg border-2 border-ink/20 px-2.5 py-1.5 text-sm font-bold transition-all hover:-translate-y-0.5 hover:border-ink hover:shadow-block-sm active:translate-y-0"
          >
            <Chat className="h-4 w-4" />
            {post.comments.length}
          </button>
          <button
            onClick={onShare}
            className="ml-auto flex items-center gap-1.5 rounded-lg border-2 border-ink/20 px-2.5 py-1.5 text-sm font-bold transition-all hover:-translate-y-0.5 hover:border-ink hover:shadow-block-sm active:translate-y-0"
          >
            <Share className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>
    </article>
  );
}
