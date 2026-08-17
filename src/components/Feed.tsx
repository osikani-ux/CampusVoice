import { CATEGORIES, CATEGORY_META, fmt } from "../data";
import type { Announcement, Category, Post } from "../data";
import { AnnouncementCard, FeedCard } from "./FeedCard";
import { Flame, Megaphone } from "./icons";

export type FeedTab = "For You" | "Trending" | "Latest";
const TABS: FeedTab[] = ["For You", "Trending", "Latest"];

export function Feed({
  posts, announcements, tab, onTab, category, onCategory, query, onClearQuery,
  onOpen, onLike, onUseful, onSave, onShare, onVote,
}: {
  posts: Post[];
  announcements: Announcement[];
  tab: FeedTab;
  onTab: (t: FeedTab) => void;
  category: "All" | Category;
  onCategory: (c: "All" | Category) => void;
  query: string;
  onClearQuery: () => void;
  onOpen: (id: string) => void;
  onLike: (id: string) => void;
  onUseful: (id: string) => void;
  onSave: (id: string) => void;
  onShare: (id: string) => void;
  onVote: (postId: string, option: number) => void;
}) {
  const q = query.trim().toLowerCase().replace(/^#/, "");

  let visible = posts.filter((p) => {
    const catOk = category === "All" || p.category === category;
    const qOk =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.author.name.toLowerCase().includes(q);
    return catOk && qOk;
  });

  if (tab === "Trending") visible = visible.filter((p) => p.trending);
  if (tab === "Latest") visible = [...visible].sort((a, b) => a.minsAgo - b.minsAgo);

  // Interleave verified announcements into the "For You" home feed
  const showNotices = tab === "For You" && category === "All" && !q;
  const items: ({ type: "post"; post: Post } | { type: "notice"; a: Announcement })[] = [];
  visible.forEach((p, i) => {
    items.push({ type: "post", post: p });
    if (showNotices && i === 1 && announcements[0]) items.push({ type: "notice", a: announcements[0] });
    if (showNotices && i === 4 && announcements[1]) items.push({ type: "notice", a: announcements[1] });
  });

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex overflow-hidden rounded-lg border-2 border-ink bg-card shadow-block-sm">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => onTab(t)}
              className={`flex items-center gap-1.5 px-3.5 py-2 font-display text-sm font-bold transition-colors ${
                tab === t ? "bg-ink text-gold" : "hover:bg-gold/20"
              }`}
            >
              {t === "Trending" && <Flame className="h-3.5 w-3.5" />}
              {t}
            </button>
          ))}
        </div>
        {q && (
          <button
            onClick={onClearQuery}
            className="flex items-center gap-1.5 rounded-lg border-2 border-ink bg-gold px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-wide shadow-block-sm transition-all hover:-translate-y-0.5"
          >
            Results for “{query}” ✕
          </button>
        )}
        <span className="ml-auto hidden font-mono text-[11px] uppercase tracking-wider text-ink-soft sm:block">
          {fmt(visible.length)} stories
        </span>
      </div>

      {/* Category chips */}
      <div className="thin-scroll mt-3 flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => onCategory("All")}
          className={`shrink-0 rounded-full border-2 px-3.5 py-1.5 text-xs font-bold transition-all hover:-translate-y-0.5 ${
            category === "All" ? "border-ink bg-ink text-paper" : "border-ink/30 bg-card hover:border-ink"
          }`}
        >
          All categories
        </button>
        {CATEGORIES.map((c) => {
          const active = category === c;
          return (
            <button
              key={c}
              onClick={() => onCategory(active ? "All" : c)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border-2 px-3.5 py-1.5 text-xs font-bold transition-all hover:-translate-y-0.5 ${
                active ? "border-ink text-ink" : "border-ink/30 bg-card hover:border-ink"
              }`}
              style={active ? { backgroundColor: CATEGORY_META[c].soft } : undefined}
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: CATEGORY_META[c].color }} />
              {c}
            </button>
          );
        })}
      </div>

      {/* Cards */}
      <div className="mt-5 grid gap-5">
        {items.map((item, i) =>
          item.type === "post" ? (
            <FeedCard
              key={item.post.id}
              post={item.post}
              index={i}
              onOpen={() => onOpen(item.post.id)}
              onLike={() => onLike(item.post.id)}
              onUseful={() => onUseful(item.post.id)}
              onSave={() => onSave(item.post.id)}
              onShare={() => onShare(item.post.id)}
              onVote={(o) => onVote(item.post.id, o)}
            />
          ) : (
            <AnnouncementCard key={item.a.id} a={item.a} />
          )
        )}

        {items.length === 0 && (
          <div className="grid place-items-center rounded-xl border-2 border-dashed border-ink/40 bg-card/60 px-6 py-16 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-xl border-2 border-ink bg-gold shadow-block-sm">
              <Megaphone className="h-7 w-7" />
            </span>
            <p className="mt-4 font-display text-xl font-extrabold">No stories on this frequency</p>
            <p className="mt-1 max-w-sm text-sm text-ink-soft">
              Try another category or tab — or be the first voice: hit Write and break the story yourself.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
