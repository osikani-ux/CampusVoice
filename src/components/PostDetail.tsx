import { useEffect, useState } from "react";
import { CATEGORY_META, currentUser, fmt } from "../data";
import type { Post } from "../data";
import { resolveImg } from "../lib/images";
import { PollBlock } from "./FeedCard";
import {
  ArrowLeft, BadgeCheck, Bookmark, Bulb, Chat, Clock, CloseIcon,
  Heart, MaskIcon, Send, Share,
} from "./icons";

export function PostDetail({
  post, onClose, onLike, onUseful, onSave, onShare, onVote, onComment, onFollow, followed, onReport,
}: {
  post: Post;
  onClose: () => void;
  onLike: (id: string) => void;
  onUseful: (id: string) => void;
  onSave: (id: string) => void;
  onShare: (id: string) => void;
  onVote: (postId: string, option: number) => void;
  onComment: (postId: string, text: string) => void;
  onFollow: (id: string) => void;
  followed: boolean;
  onReport: () => void;
}) {
  const [draft, setDraft] = useState("");
  const meta = CATEGORY_META[post.category];
  const img = resolveImg(post.image);
  const own = post.author.id === currentUser.id && !post.anonymous;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const submit = () => {
    const text = draft.trim();
    if (!text) return;
    onComment(post.id, text);
    setDraft("");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-ink/70 p-0 sm:p-6" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="toast-in mx-auto min-h-full max-w-3xl rounded-none border-2 border-ink bg-paper shadow-block sm:min-h-0 sm:rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Reader bar */}
        <div className="sticky top-0 z-10 flex items-center gap-3 border-b-2 border-ink bg-card px-4 py-3">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-lg border-2 border-ink bg-gold px-3 py-1.5 text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-block-sm active:translate-y-0"
          >
            <ArrowLeft className="h-4 w-4" /> Back to feed
          </button>
          <span
            className="ml-auto rounded-md px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider"
            style={{ backgroundColor: meta.soft, color: meta.color }}
          >
            {post.category}
          </span>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg border-2 border-ink/25 hover:border-ink" aria-label="Close">
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 sm:p-8">
          {/* Byline */}
          <div className="flex items-center gap-3">
            {post.anonymous ? (
              <span className="grid h-12 w-12 place-items-center rounded-lg border-2 border-dashed border-ink/50 bg-card">
                <MaskIcon className="h-6 w-6 text-ink-soft" />
              </span>
            ) : (
              <span
                className="grid h-12 w-12 place-items-center rounded-lg border-2 border-ink font-display text-base font-extrabold text-paper"
                style={{ backgroundColor: post.author.color }}
              >
                {post.author.initials}
              </span>
            )}
            <div>
              <p className="flex items-center gap-1.5 font-display text-base font-bold">
                {post.anonymous ? "Anonymous" : post.author.name}
                {!post.anonymous && post.author.verified && <BadgeCheck className="h-4 w-4 text-cobalt" />}
              </p>
              <p className="flex items-center gap-1.5 font-mono text-[11px] text-ink-soft">
                <Clock className="h-3 w-3" />
                {post.anonymous ? "Identity protected · HCU confessions" : `${post.author.level} · ${post.author.dept}`} · {post.time === "now" ? "just now" : `${post.time} ago`} · {post.readMins} min read
              </p>
            </div>
          </div>

          <h1 className="mt-5 font-display text-3xl font-extrabold leading-[1.08] tracking-tight sm:text-[2.6rem]">
            {post.title}
          </h1>

          {/* Actions */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button
              onClick={() => onLike(post.id)}
              className={`flex items-center gap-1.5 rounded-lg border-2 px-3 py-1.5 text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-block-sm active:translate-y-0 ${
                post.liked ? "border-ink bg-rasp text-white" : "border-ink bg-card hover:border-rasp hover:text-rasp"
              }`}
            >
              <span key={post.likes} className={post.liked ? "pop" : ""}>
                <Heart className="h-4 w-4" filled={post.liked} />
              </span>
              {fmt(post.likes)}
            </button>
            <button
              onClick={() => onUseful(post.id)}
              className={`flex items-center gap-1.5 rounded-lg border-2 px-3 py-1.5 text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-block-sm active:translate-y-0 ${
                post.usefulMarked ? "border-ink bg-gold" : "border-ink bg-card hover:bg-gold/25"
              }`}
            >
              <Bulb className="h-4 w-4" filled={post.usefulMarked} />
              {fmt(post.useful)} found useful
            </button>
            <button
              onClick={() => onShare(post.id)}
              className="flex items-center gap-1.5 rounded-lg border-2 border-ink bg-card px-3 py-1.5 text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-block-sm active:translate-y-0"
            >
              <Share className="h-4 w-4" /> Share
            </button>
            <button
              onClick={() => onSave(post.id)}
              className={`ml-auto flex items-center gap-1.5 rounded-lg border-2 px-3 py-1.5 text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-block-sm active:translate-y-0 ${
                post.saved ? "border-ink bg-gold" : "border-ink bg-card hover:bg-gold/25"
              }`}
            >
              <Bookmark className="h-4 w-4" filled={post.saved} />
              {post.saved ? "Saved" : "Save"}
            </button>
          </div>

          {img && (
            <img src={img} alt={post.title} className="mt-6 w-full rounded-xl border-2 border-ink shadow-block-sm" />
          )}

          {/* Body */}
          <div className="mt-6 space-y-4">
            {post.body.map((para, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "border-l-4 border-gold pl-4 font-display text-lg font-semibold leading-relaxed text-ink"
                    : "text-[15.5px] leading-relaxed text-ink-soft"
                }
              >
                {para}
              </p>
            ))}
          </div>

          {post.poll && <PollBlock poll={post.poll} onVote={(o) => onVote(post.id, o)} />}

          {/* Tags */}
          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span key={t} className="rounded-md border-2 border-ink/15 bg-card px-2 py-1 font-mono text-[11px] font-semibold text-pine">
                {t}
              </span>
            ))}
          </div>

          {/* Author card */}
          {!post.anonymous && (
            <div className="mt-8 flex flex-col gap-4 rounded-xl border-2 border-ink bg-card p-5 shadow-block-sm sm:flex-row sm:items-center">
              <span
                className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border-2 border-ink font-display text-lg font-extrabold text-paper"
                style={{ backgroundColor: post.author.color }}
              >
                {post.author.initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 font-display text-base font-bold">
                  {post.author.name} {post.author.verified && <BadgeCheck className="h-4 w-4 text-cobalt" />}
                </p>
                <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">{post.author.bio}</p>
                <p className="mt-1 font-mono text-[11px] text-ink-soft">
                  {fmt(post.author.followers + (followed ? 1 : 0))} followers · {post.author.articles} articles
                </p>
              </div>
              {!own && (
                <button
                  onClick={() => onFollow(post.author.id)}
                  className={`shrink-0 rounded-lg border-2 px-4 py-2 font-display text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-block-sm active:translate-y-0 ${
                    followed ? "border-ink bg-ink text-paper" : "border-ink bg-gold"
                  }`}
                >
                  {followed ? "Following ✓" : "Follow"}
                </button>
              )}
            </div>
          )}

          {/* Comments */}
          <section className="mt-8">
            <h2 className="flex items-center gap-2 font-display text-xl font-extrabold">
              <Chat className="h-5 w-5 text-pine" /> {post.comments.length} comment{post.comments.length === 1 ? "" : "s"}
            </h2>

            <div className="mt-4 flex gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border-2 border-ink bg-pine font-display text-xs font-extrabold text-paper">
                YM
              </span>
              <div className="flex flex-1 gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  placeholder="Add your voice — keep it kind…"
                  className="min-w-0 flex-1 rounded-lg border-2 border-ink bg-card px-3 py-2 text-sm focus:bg-white focus:shadow-block-sm"
                />
                <button
                  onClick={submit}
                  disabled={!draft.trim()}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border-2 border-ink bg-gold transition-all enabled:hover:-translate-y-0.5 enabled:hover:shadow-block-sm disabled:opacity-40"
                  aria-label="Post comment"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>

            <ul className="mt-5 space-y-4">
              {post.comments.map((c) => (
                <li key={c.id} className="flex gap-3">
                  <span
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border-2 border-ink font-display text-xs font-extrabold text-paper"
                    style={{ backgroundColor: c.color }}
                  >
                    {c.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </span>
                  <div className="flex-1 rounded-lg rounded-tl-none border-2 border-line bg-card px-3.5 py-2.5">
                    <p className="flex items-baseline gap-2 text-sm">
                      <span className="font-display font-bold">{c.name}</span>
                      <span className="font-mono text-[10px] text-ink-soft">{c.time === "now" ? "just now" : `${c.time} ago`}</span>
                    </p>
                    <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">{c.text}</p>
                  </div>
                </li>
              ))}
              {post.comments.length === 0 && (
                <li className="rounded-lg border-2 border-dashed border-ink/30 px-4 py-6 text-center text-sm text-ink-soft">
                  No comments yet. Be the first voice.
                </li>
              )}
            </ul>
          </section>

          {/* Moderation */}
          <div className="mt-8 flex items-center justify-between border-t-2 border-line pt-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
              Community guidelines apply · harassment, doxxing and scams are removed
            </p>
            <button
              onClick={onReport}
              className="shrink-0 font-mono text-[11px] font-bold uppercase tracking-wide text-rasp underline decoration-rasp/40 underline-offset-4 transition-colors hover:decoration-rasp"
            >
              Report story
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
