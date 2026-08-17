import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { CATEGORIES, CATEGORY_META, currentUser } from "../data";
import type { Category, Draft, Post } from "../data";
import { CloseIcon, GradCap, MaskIcon, Pen, Spark } from "./icons";

/* ---------- tiny toolbar glyphs ---------- */

const G = ({ d, className }: { d: string; className?: string }) => (
  <svg className={className ?? "h-4 w-4"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ListUlIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M9 6h11M9 12h11M9 18h11" />
    <circle cx="4.5" cy="6" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="4.5" cy="12" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="4.5" cy="18" r="1.4" fill="currentColor" stroke="none" />
  </svg>
);
const ListOlIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M10 6h10M10 12h10M10 18h10" />
    <text x="2.2" y="8.4" fontSize="7.5" fontFamily="inherit" fontWeight="700" fill="currentColor" stroke="none">1</text>
    <text x="2.2" y="14.6" fontSize="7.5" fontFamily="inherit" fontWeight="700" fill="currentColor" stroke="none">2</text>
    <text x="2.2" y="20.8" fontSize="7.5" fontFamily="inherit" fontWeight="700" fill="currentColor" stroke="none">3</text>
  </svg>
);
const QuoteIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9.6 6C6.8 7.6 5 10 5 13.4c0 2.7 1.7 4.6 4 4.6 2 0 3.5-1.5 3.5-3.5S11 11 9 11c-.3 0-.7 0-.9.1.3-1.6 1.6-3.2 3.2-4.1L9.6 6zm9 0c-2.8 1.6-4.6 4-4.6 7.4 0 2.7 1.7 4.6 4 4.6 2 0 3.5-1.5 3.5-3.5S20 11 18 11c-.3 0-.7 0-.9.1.3-1.6 1.6-3.2 3.2-4.1L18.6 6z" />
  </svg>
);
const AlignLeftIcon = () => <G d="M4 6h16M4 12h10M4 18h14" />;
const AlignCenterIcon = () => <G d="M4 6h16M7 12h10M5 18h14" />;
const UndoIcon = () => <G d="M8 5 4 9l4 4M4 9h10a6 6 0 0 1 0 12h-3" />;
const RedoIcon = () => <G d="m16 5 4 4-4 4M20 9H10a6 6 0 0 0 0 12h3" />;
const EraserIcon = () => <G d="M7 21h13M6.5 17.5 3.8 14.8a2 2 0 0 1 0-2.8L13 2.8a2 2 0 0 1 2.8 0l4.4 4.4a2 2 0 0 1 0 2.8L11 19.2a2 2 0 0 1-1.4.6H6.2l.3-2.3z" />;

/* ---------- toolbar button ---------- */

function TBtn({
  label, onClick, active, children, wide,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`grid h-8 place-items-center rounded-md border transition-all duration-100 active:translate-y-px ${wide ? "px-2" : "w-8"} ${
        active
          ? "border-ink bg-ink text-gold shadow-block-sm"
          : "border-transparent text-ink hover:border-ink/25 hover:bg-gold/25"
      }`}
    >
      {children}
    </button>
  );
}

const Divider = () => <span className="mx-1 h-6 w-0.5 shrink-0 rounded bg-line" />;

/* ---------- helpers ---------- */

const stripTags = (html: string): string => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

export function Composer({
  onClose, onPublish, onSaveDraft, notify, initial,
}: {
  onClose: () => void;
  onPublish: (p: Post) => void;
  onSaveDraft: (d: Draft) => void;
  notify: (msg: string) => void;
  initial?: Draft | null;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState<Category>(initial?.category ?? "Campus Life");
  const [anonymous, setAnonymous] = useState(initial?.anonymous ?? false);
  const [error, setError] = useState("");
  const [words, setWords] = useState(0);
  const [active, setActive] = useState<Record<string, boolean>>({});
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initial?.bodyHtml && editorRef.current) {
      editorRef.current.innerHTML = initial.bodyHtml;
      refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = () => {
    const el = editorRef.current;
    if (!el) return;
    setWords((el.innerText.trim().match(/\S+/g) || []).length);
    const q = (c: string) => {
      try { return document.queryCommandState(c); } catch { return false; }
    };
    setActive({
      bold: q("bold"),
      italic: q("italic"),
      underline: q("underline"),
      strike: q("strikeThrough"),
      ul: q("insertUnorderedList"),
      ol: q("insertOrderedList"),
      left: q("justifyLeft"),
      center: q("justifyCenter"),
    });
  };

  useEffect(() => {
    document.addEventListener("selectionchange", refresh);
    return () => document.removeEventListener("selectionchange", refresh);
  }, []);

  const exec = (cmd: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value);
    refresh();
    setError("");
  };

  const setBlock = (tag: string) => exec("formatBlock", tag);

  const collectBody = (): string[] => {
    const el = editorRef.current;
    if (!el) return [];
    const out: string[] = [];
    el.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const t = (node.textContent || "").trim();
        if (t) out.push(t);
      } else if (node instanceof HTMLElement && node.textContent && node.textContent.trim()) {
        out.push(node.outerHTML);
      }
    });
    return out;
  };

  const plainText = (): string => stripTags(editorRef.current?.innerHTML ?? "");

  const publish = () => {
    const paragraphs = collectBody();
    const text = plainText();
    if (title.trim().length < 8) {
      setError("Give your story a headline of at least 8 characters.");
      return;
    }
    if (text.length < 40) {
      setError("Write at least a couple of sentences — your campus is listening.");
      return;
    }
    const first = paragraphs[0] ? stripTags(paragraphs[0]) : text;
    const post: Post = {
      id: `u${Date.now()}`,
      title: title.trim(),
      excerpt: `${first.slice(0, 170)}${first.length > 170 ? "…" : ""}`,
      body: paragraphs,
      author: currentUser,
      anonymous,
      category,
      time: "now",
      minsAgo: 0,
      readMins: Math.max(1, Math.round(text.split(/\s+/).length / 200)),
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

  const saveDraft = () => {
    const bodyHtml = editorRef.current?.innerHTML ?? "";
    const hasContent = title.trim().length > 0 || plainText().length > 0;
    if (!hasContent) {
      setError("Write a headline or a few words before saving a draft.");
      return;
    }
    onSaveDraft({
      id: initial?.id ?? `d${Date.now()}`,
      title: title.trim() || "Untitled draft",
      bodyHtml,
      category,
      anonymous,
      updated: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
    });
    notify("Draft saved — find it in your Creator Studio");
    onClose();
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

          {/* Rich editor */}
          <div>
            <div className="mb-1.5 flex items-end justify-between gap-2">
              <label className="block font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-ink-soft">
                What's your story?
              </label>
              <span className="font-mono text-[10px] text-ink-soft">
                {words} word{words === 1 ? "" : "s"} · ~{Math.max(1, Math.round(words / 200))} min read
              </span>
            </div>

            <div className="overflow-hidden rounded-lg border-2 border-ink bg-card focus-within:bg-white focus-within:shadow-block-sm">
              {/* Formatting ribbon */}
              <div className="thin-scroll flex items-center gap-0.5 overflow-x-auto border-b-2 border-line bg-paper/80 px-2 py-1.5">
                <TBtn label="Undo" onClick={() => exec("undo")}><UndoIcon /></TBtn>
                <TBtn label="Redo" onClick={() => exec("redo")}><RedoIcon /></TBtn>
                <Divider />
                <TBtn label="Heading 2" onClick={() => setBlock("<h2>")} wide>
                  <span className="font-display text-xs font-extrabold">H2</span>
                </TBtn>
                <TBtn label="Heading 3" onClick={() => setBlock("<h3>")} wide>
                  <span className="font-display text-xs font-extrabold">H3</span>
                </TBtn>
                <TBtn label="Paragraph" onClick={() => setBlock("<p>")} wide>
                  <span className="font-display text-xs font-extrabold">¶</span>
                </TBtn>
                <Divider />
                <TBtn label="Bold (Ctrl+B)" onClick={() => exec("bold")} active={active.bold}>
                  <span className="font-display text-sm font-black">B</span>
                </TBtn>
                <TBtn label="Italic (Ctrl+I)" onClick={() => exec("italic")} active={active.italic}>
                  <span className="font-display text-sm font-bold italic">I</span>
                </TBtn>
                <TBtn label="Underline (Ctrl+U)" onClick={() => exec("underline")} active={active.underline}>
                  <span className="font-display text-sm font-bold underline decoration-2">U</span>
                </TBtn>
                <TBtn label="Strikethrough" onClick={() => exec("strikeThrough")} active={active.strike}>
                  <span className="font-display text-sm font-bold line-through">S</span>
                </TBtn>
                <Divider />
                <TBtn label="Bullet list" onClick={() => exec("insertUnorderedList")} active={active.ul}>
                  <ListUlIcon />
                </TBtn>
                <TBtn label="Numbered list" onClick={() => exec("insertOrderedList")} active={active.ol}>
                  <ListOlIcon />
                </TBtn>
                <TBtn label="Blockquote" onClick={() => setBlock("<blockquote>")}>
                  <QuoteIcon />
                </TBtn>
                <Divider />
                <TBtn label="Align left" onClick={() => exec("justifyLeft")} active={active.left}>
                  <AlignLeftIcon />
                </TBtn>
                <TBtn label="Align center" onClick={() => exec("justifyCenter")} active={active.center}>
                  <AlignCenterIcon />
                </TBtn>
                <Divider />
                <TBtn label="Clear formatting" onClick={() => { exec("removeFormat"); exec("formatBlock", "<p>"); }}>
                  <EraserIcon />
                </TBtn>
              </div>

              {/* Editable canvas */}
              <div
                ref={editorRef}
                contentEditable
                role="textbox"
                aria-multiline="true"
                aria-label="Story body"
                data-placeholder="Write here… select some text and hit Bold, drop in a heading, quote a friend. Be honest, be useful, be kind."
                onInput={() => { refresh(); setError(""); }}
                onKeyUp={refresh}
                onMouseUp={refresh}
                className="rich-editor min-h-[240px] max-h-[420px] overflow-y-auto thin-scroll px-4 py-3.5 text-[15px] leading-relaxed outline-none"
              />
            </div>
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
              <Spark className="h-3.5 w-3.5 text-gold" /> Auto-saves nothing — your words, your control
            </p>
            <button
              onClick={saveDraft}
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
