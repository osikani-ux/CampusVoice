import { useEffect, useState } from "react";
import {
  announcements, currentUser, events, fmt, initialPosts,
} from "./data";
import type { Post } from "./data";
import type { Category } from "./data";
import { useRevealAll } from "./lib/hooks";
import { MobileNav, Sidebar, Ticker, TopBar } from "./components/Shell";
import type { View } from "./components/Shell";
import { Feed } from "./components/Feed";
import type { FeedTab } from "./components/Feed";
import { RightRail } from "./components/RightRail";
import { PostDetail } from "./components/PostDetail";
import { Composer } from "./components/Composer";
import { EventsView } from "./components/EventsView";
import { MarketView } from "./components/MarketView";
import { DiscoverView } from "./components/DiscoverView";
import { StudioView } from "./components/StudioView";
import { Check, WaveHand } from "./components/icons";

interface Toast {
  id: number;
  msg: string;
}

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

export default function App() {
  const [view, setView] = useState<View>("feed");
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [tab, setTab] = useState<FeedTab>("For You");
  const [category, setCategory] = useState<"All" | Category>("All");
  const [query, setQuery] = useState("");
  const [composerOpen, setComposerOpen] = useState(false);
  const [campus, setCampus] = useState("Heritage Christian University");
  const [rsvps, setRsvps] = useState<Set<string>>(new Set());
  const [follows, setFollows] = useState<Set<string>>(new Set());
  const [joined, setJoined] = useState<Set<string>>(new Set());
  const [toasts, setToasts] = useState<Toast[]>([]);

  useRevealAll([view, posts.length, tab, category, query, activePostId, composerOpen]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [view, activePostId]);

  const notify = (msg: string) => {
    const id = Date.now() + Math.random();
    setToasts((ts) => [...ts.slice(-2), { id, msg }]);
    window.setTimeout(() => setToasts((ts) => ts.filter((t) => t.id !== id)), 2900);
  };

  const patchPost = (id: string, fn: (p: Post) => Post) =>
    setPosts((ps) => ps.map((p) => (p.id === id ? fn(p) : p)));

  const onLike = (id: string) =>
    patchPost(id, (p) => ({ ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) }));

  const onUseful = (id: string) =>
    patchPost(id, (p) => ({ ...p, usefulMarked: !p.usefulMarked, useful: p.useful + (p.usefulMarked ? -1 : 1) }));

  const onSave = (id: string) => {
    const target = posts.find((p) => p.id === id);
    patchPost(id, (p) => ({ ...p, saved: !p.saved }));
    notify(target?.saved ? "Removed from your reading list" : "Saved to your reading list");
  };

  const onShare = (id: string) => {
    try {
      void navigator.clipboard?.writeText(`https://campusvoice.app/story/${id}`);
    } catch {
      /* clipboard unavailable — toast still confirms */
    }
    notify("Story link copied to clipboard");
  };

  const onVote = (postId: string, option: number) => {
    patchPost(postId, (p) =>
      p.poll && p.poll.voted === null
        ? {
            ...p,
            poll: {
              ...p.poll,
              voted: option,
              options: p.poll.options.map((o, j) => (j === option ? { ...o, votes: o.votes + 1 } : o)),
            },
          }
        : p
    );
    notify("Your vote was counted");
  };

  const onComment = (postId: string, text: string) => {
    patchPost(postId, (p) => ({
      ...p,
      comments: [...p.comments, { id: `c${Date.now()}`, name: currentUser.name, text, time: "now", color: currentUser.color }],
    }));
    notify("Comment posted to the discussion");
  };

  const onPublish = (post: Post) => {
    setPosts((ps) => [post, ...ps]);
    setComposerOpen(false);
    setView("feed");
    setTab("For You");
    setCategory("All");
    setQuery("");
    notify(post.anonymous ? "Published anonymously — your identity is safe" : "Published to campus — it's live on the feed");
  };

  const onFollow = (id: string) => {
    setFollows((f) => {
      const next = new Set(f);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const onRsvp = (id: string) => {
    const ev = events.find((e) => e.id === id);
    setRsvps((r) => {
      const next = new Set(r);
      if (next.has(id)) next.delete(id);
      else {
        next.add(id);
        if (ev) notify(`You're going to ${ev.title}`);
      }
      return next;
    });
  };

  const onJoin = (id: string) => {
    setJoined((j) => {
      const next = new Set(j);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const onTopic = (tag: string) => {
    setQuery(tag);
    setCategory("All");
    setTab("For You");
    setView("feed");
  };

  const activePost = activePostId ? posts.find((p) => p.id === activePostId) ?? null : null;

  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  const liveCount = 1243 + (posts.length - initialPosts.length) * 7;

  return (
    <div className="min-h-screen">
      <TopBar
        onNav={setView}
        onWrite={() => setComposerOpen(true)}
        query={query}
        onQuery={setQuery}
        campus={campus}
        onCampus={setCampus}
        notify={notify}
      />
      <Ticker />
      <MobileNav view={view} onNav={setView} onWrite={() => setComposerOpen(true)} />

      <div
        className={`mx-auto grid max-w-[1440px] gap-7 px-4 py-6 lg:px-6 ${
          view === "feed"
            ? "lg:grid-cols-[240px_minmax(0,1fr)_330px]"
            : "lg:grid-cols-[240px_minmax(0,1fr)]"
        }`}
      >
        <Sidebar view={view} onNav={setView} onWrite={() => setComposerOpen(true)} />

        <main className="min-w-0">
          {view === "feed" && (
            <header className="reveal mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-pine">
                  {campus} · {today}
                </p>
                <h1 className="mt-1.5 flex items-center gap-3 font-display text-3xl font-extrabold tracking-tight sm:text-[2.75rem] sm:leading-[1.05]">
                  {greeting()}, Yaw
                  <span className="floaty inline-block">
                    <WaveHand className="h-8 w-8 text-gold sm:h-10 sm:w-10" />
                  </span>
                </h1>
                <p className="mt-1.5 max-w-md text-sm leading-relaxed text-ink-soft">
                  Here's what your campus is writing, arguing and selling today.
                </p>
              </div>
              <div className="flex gap-2">
                <span className="flex items-center gap-2 rounded-lg border-2 border-ink bg-card px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-wide shadow-block-sm">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-moss" />
                  {fmt(liveCount)} online
                </span>
                <span className="hidden items-center gap-2 rounded-lg border-2 border-ink bg-card px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-wide shadow-block-sm sm:flex">
                  {posts.length} stories today
                </span>
              </div>
            </header>
          )}

          {view === "feed" && (
            <Feed
              posts={posts}
              announcements={announcements}
              tab={tab}
              onTab={setTab}
              category={category}
              onCategory={setCategory}
              query={query}
              onClearQuery={() => setQuery("")}
              onOpen={setActivePostId}
              onLike={onLike}
              onUseful={onUseful}
              onSave={onSave}
              onShare={onShare}
              onVote={onVote}
            />
          )}
          {view === "discover" && (
            <DiscoverView follows={follows} onFollow={onFollow} joined={joined} onJoin={onJoin} notify={notify} />
          )}
          {view === "events" && <EventsView rsvps={rsvps} onRsvp={onRsvp} notify={notify} />}
          {view === "market" && <MarketView notify={notify} />}
          {view === "studio" && <StudioView notify={notify} />}
        </main>

        {view === "feed" && (
          <RightRail
            rsvps={rsvps}
            onRsvp={onRsvp}
            follows={follows}
            onFollow={onFollow}
            onTopic={onTopic}
            notify={notify}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="mt-10 border-t-2 border-ink bg-ink py-8 text-paper">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 px-4 sm:flex-row lg:px-6">
          <p className="font-display text-lg font-extrabold">
            Campus<span className="text-gold">Voice</span>
            <span className="ml-2 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-paper/60">
              The digital community for university life
            </span>
          </p>
          <div className="flex gap-5 font-mono text-[11px] uppercase tracking-wider text-paper/70">
            {["About", "Guidelines", "Safety", "For universities"].map((l) => (
              <button key={l} onClick={() => notify(`${l} opens in the full release`)} className="transition-colors hover:text-gold">
                {l}
              </button>
            ))}
          </div>
        </div>
      </footer>

      {/* Overlays */}
      {activePost && (
        <PostDetail
          post={activePost}
          onClose={() => setActivePostId(null)}
          onLike={onLike}
          onUseful={onUseful}
          onSave={onSave}
          onShare={onShare}
          onVote={onVote}
          onComment={onComment}
          onFollow={onFollow}
          followed={follows.has(activePost.author.id)}
          onReport={() => notify("Report submitted — campus moderators review within 24h")}
        />
      )}
      {composerOpen && (
        <Composer onClose={() => setComposerOpen(false)} onPublish={onPublish} notify={notify} />
      )}

      {/* Toasts */}
      <div className="pointer-events-none fixed bottom-5 left-1/2 z-[70] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4 sm:left-auto sm:right-5 sm:translate-x-0 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="toast-in pointer-events-auto flex items-center gap-2.5 rounded-xl border-2 border-gold bg-ink px-4 py-3 text-sm font-semibold text-paper shadow-block"
          >
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold">
              <Check className="h-3.5 w-3.5 text-ink" />
            </span>
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}
