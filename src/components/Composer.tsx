import { useState } from "react";
import { CATEGORIES, CATEGORY_META, currentUser } from "../data";
import type { Category, Post } from "../data";
import { CloseIcon, GradCap, MaskIcon, Pen, Spark } from "./icons";

export function Composer({
  onClose, onPublish, notify,
}: {
  onClose: () => void;
  onPublish: (p: Post) => void;
  notify: (msg: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<Category>("Campus Life");
  const [anonymous, setAnonymous] = useState(false);
  const [error, setError] = useState("");

  const publish = () => {
    if (title.trim().length < 8) {
      setError("Give your story a headline of at least 8 characters.");
      return;
    }
    if (body.trim().length < 40) {
      setError("Write at least a couple of sentences — your campus is listening.");
      return;
    }
    const paragraphs = body
      .split(/\n{2,}/)
      .map((s) => s.trim())
      .filter(Boolean);
    const post: Post = {
      id: `u${Date.now()}`,
      title: title.trim(),
      excerpt: paragraphs[0] ? `${paragraphs[0].slice(0, 170)}${paragraphs[0].length > 170 ? "…" : ""}` : "",
      body: paragraphs,
      author: currentUser,
      anonymous,
      category,
      time: "now",
      minsAgo: 0,
      readMins: Math.max(1, Math.round(body.trim().split(/\s+/).length / 200)),
      likes: 0,
      liked: false,
      useful: 0,
      usefulMarked: false,
      saved: false,
      cover: { bg: CATEGORY_META[category].color, big: "NEW", sub: `JUST PUBLISHED · ${category.toUpperCase()}` },
      comments: [],
      tags: [`#${category.replace(/\s+/g, "")}`, "#HCU"],
    };
    onPublish(post);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-ink/70 p-0 sm:p-6" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="toast-in mx-auto min-h-full max-w-2xl rounded-none border-2 border-ink bg-paper shadow-block sm:min-h-0 sm:rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b-2 border-ink bg-gold px-5 py-3.5">
          <Pen className="h-5 w-5" />
          <div className="leading-tight">
            <p className="font-display text-lg font-extrabold">Create something</p>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/70">
              Every student is a writer here
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto grid h-9 w-9 place-items-center rounded-lg border-2 border-ink bg-card transition-all hover:-translate-y-0.5 hover:shadow-block-sm"
            aria-label="Close composer"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div>
            <label className="mb-1.5 block font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-ink-soft">
              Headline
            </label>
            <input
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(""); }}
              placeholder="e.g. How the hostel water crisis actually got solved"
              className="w-full rounded-lg border-2 border-ink bg-card px-3.5 py-3 font-display text-lg font-bold placeholder:font-body placeholder:text-base placeholder:font-normal placeholder:text-ink-soft/60 focus:bg-white focus:shadow-block-sm"
              maxLength={110}
            />
            <p className="mt-1 text-right font-mono text-[10px] text-ink-soft">{title.length}/110</p>
          </div>

          <div>
            <label className="mb-1.5 block font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-ink-soft">
              What's your story?
            </label>
            <textarea
              value={body}
              onChange={(e) => { setBody(e.target.value); setError(""); }}
              placeholder={"Write here…\n\nSeparate paragraphs with a blank line. Be honest, be useful, be kind."}
              rows={9}
              className="w-full resize-y rounded-lg border-2 border-ink bg-card px-3.5 py-3 text-[15px] leading-relaxed placeholder:text-ink-soft/60 focus:bg-white focus:shadow-block-sm"
            />
          </div>

          <div>
            <label className="mb-1.5 block font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-ink-soft">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-xs font-bold transition-all hover:-translate-y-0.5 ${
                    category === c ? "border-ink" : "border-ink/30 hover:border-ink"
                  }`}
                  style={category === c ? { backgroundColor: CATEGORY_META[c].soft } : { backgroundColor: "var(--color-card)" }}
                >
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: CATEGORY_META[c].color }} />
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border-2 border-ink/20 bg-card px-3.5 py-3">
              <p className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-soft">
                <GradCap className="h-3.5 w-3.5 text-pine" /> Campus
              </p>
              <p className="mt-1 text-sm font-bold">Heritage Christian University</p>
            </div>
            <button
              onClick={() => setAnonymous((a) => !a)}
              className={`rounded-lg border-2 px-3.5 py-3 text-left transition-all hover:-translate-y-0.5 ${
                anonymous ? "border-ink bg-ink text-paper shadow-block-gold" : "border-ink/20 bg-card hover:border-ink"
              }`}
            >
              <p className={`flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] ${anonymous ? "text-gold" : "text-ink-soft"}`}>
                <MaskIcon className="h-3.5 w-3.5" /> Anonymous story
              </p>
              <p className={`mt-1 text-sm font-bold ${anonymous ? "" : "text-ink"}`}>
                {anonymous ? "On — your identity stays hidden" : "Off — publishing as Yaw Mensah"}
              </p>
            </button>
          </div>

          {error && (
            <p className="rounded-lg border-2 border-rasp bg-rasp/10 px-3.5 py-2.5 text-sm font-semibold text-rasp">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 border-t-2 border-line pt-4">
            <p className="mr-auto flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-soft">
              <Spark className="h-3.5 w-3.5 text-gold" /> AI assistant available in full release
            </p>
            <button
              onClick={() => { notify("Draft saved to your studio"); onClose(); }}
              className="rounded-lg border-2 border-ink bg-card px-4 py-2.5 font-display text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-block-sm active:translate-y-0"
            >
              Save draft
            </button>
            <button
              onClick={publish}
              className="rounded-lg border-2 border-ink bg-gold px-5 py-2.5 font-display text-sm font-bold shadow-block transition-all hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_var(--color-ink)] active:translate-y-0 active:shadow-block-sm"
            >
              Publish to campus →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
