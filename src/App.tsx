import { useEffect, useMemo, useState } from "react";
import {
  announcements, events, fmt, initialPosts, toWriter,
} from "./data";
import type { Category, Draft, Post, User, Writer } from "./data";
import { clearSession, getSession, markVerified, setSession } from "./lib/auth";
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
import { AuthScreen } from "./components/AuthScreen";
import { InfoModal, ReportModal } from "./components/Modals";
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
  /* ----- auth ----- */
  const [session, setSessionUser] = useState<User | null>(() => getSession());
  const me: Writer | null = useMemo(() => (session ? toWriter(session) : null), [session]);

  const [view, setView] = useState<View>("feed");
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [tab, setTab] = useState<FeedTab>("For You");
  const [category, setCategory] = useState<"All" | Category>("All");
  const [query, setQuery] = useState("");
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerInitial, setComposerInitial] = useState<Draft | null>(null);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [reportFor, setReportFor] = useState<string | null>(null);
  const [infoTopic, setInfoTopic] = useState<string | null>(null);
  const [campus, setCampus] = useState("Heritage Christian University");
  const [rsvps, setRsvps] = useState<Set<string>>(new Set());
  const [follows, setFollows] = useState<Set<string>>(new Set());
  const [joined, setJoined] = useState<Set<string>>(new Set());
  const [toasts, setToasts] = useState<Toast[]>([]);

  const openComposer = (initial: Draft | null = null) => {
    setComposerInitial(initial);
    setComposerOpen(true);
  };

  useRevealAll([view, posts.length, tab, category, query, activePostId, composerOpen, session?.email]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [view, activePostId]);

  const notify = (msg: string) => {
    const id = Date.now() + Math.random();
    setToasts((ts) => [...ts.slice(-2), { id, msg }]);
    window.setTimeout(() => setToasts((ts) => ts.filter((t) => t.id !== id)), 2900);
  };

  /* ----- auth handlers ----- */
  const onAuthed = (u: User, isNew: boolean) => {
    setSessionUser(u);
    setSession(u.email);
    notify(
      isNew
        ? `Welcome to CampusVoice, ${u.name.split(" ")[0]} — your campus is listening`
        : `Welcome back, ${u.name.split(" ")[0]}`
    );
  };

  const onLogout = () => {
    clearSession();
    setSessionUser(null);
    setView("feed");
    setActivePostId(null);
    setComposerOpen(false);
  };

  const onVerify = () => {
    if (!session) return;
    markVerified(session.email);
    setSessionUser({ ...session, verified: true });
    notify("Student ID verified — you now carry the verified badge");
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
    if (!me) return;
    patchPost(postId, (p) => ({
      ...p,
      comments: [...p.comments, { id: `c${Date.now()}`, name: me.name, text, time: "now", color: me.color }],
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

  /* ----- reports ----- */
  const markReported = (id: string) => patchPost(id, (p) => ({ ...p, reported: true }));

  const onReportSubmit = (reason: string) => {
    if (reportFor) markReported(reportFor);
    setReportFor(null);
    notify(`Report received (${reason}) — moderators review within 24h`);
  };

  const onReportFromDetail = (reason: string) => {
    if (activePostId) markReported(activePostId);
    notify(`Report received (${reason}) — moderators review within 24h`);
  };

  /* ----- notices / tags ----- */
  const onShareNotice = (id: string) => {
    try {
      void navigator.clipboard?.writeText(`https://campusvoice.app/notice/${id}`);
    } catch { /* clipboard unavailable */ }
    notify("Official notice link copied to clipboard");
  };

  const onTag = (tag: string) => {
    setQuery(tag);
    setCategory("All");
    setTab("For You");
    setView("feed");
    setActivePostId(null);
  };

  /* ----- campus wire ticker: route each headline somewhere real ----- */
  const onTickerItem = (text: string) => {
    const t = text.toLowerCase();
    if (t.includes("freshers") || t.includes("inter-hall") || t.includes("career fair")) {
      setView("events");
      notify("Showing you the campus events board");
    } else {
      setView("discover");
      notify("Full notice is on the campus wire");
    }
  };

  /* ----- drafts ----- */
  const onSaveDraft = (d: Draft) => {
    setDrafts((ds) => {
      const exists = ds.some((x) => x.id === d.id);
      return exists ? ds.map((x) => (x.id === d.id ? d : x)) : [d, ...ds];
    });
    notify("Draft saved to your studio");
  };

  const onEditDraft = (d: Draft) => {
    setDrafts((ds) => ds.filter((x) => x.id !== d.id));
    openComposer(d);
  };

  const onDeleteDraft = (id: string) => {
    setDrafts((ds) => ds.filter((x) => x.id !== id));
    notify("Draft deleted");
  };

  const activePost = activePostId ? posts.find((p) => p.id === activePostId) ?? null : null;
  const reportPost = reportFor ? posts.find((p) => p.id === reportFor) ?? null : null;

  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  const liveCount = 1243 + (posts.length - initialPosts.length) * 7;

  /* ----- signed out: auth gate ----- */
  if (!session || !me) {
    return (
      <>
        <AuthScreen onAuthed={onAuthed} />
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
      </>
    );
  }

  /* ----- signed in ----- */
  return (
    <div className="min-h-screen">
      <TopBar
        onNav={setView}
        onWrite={() => openComposer()}
        query={query}
        onQuery={setQuery}
        campus={campus}
        onCampus={setCampus}
        notify={notify}
        me={me}
        onLogout={onLogout}
      />
      <Ticker onItem={onTickerItem} />
      <MobileNav view={view} onNav={setView} onWrite={() => openComposer()} />

      <div
        className={`mx-auto grid max-w-[1440px] gap-7 px-4 py-6 lg:px-6 ${
          view === "feed"
            ? "lg:grid-cols-[240px_minmax(0,1fr)_330px]"
            : "lg:grid-cols-[240px_minmax(0,1fr)]"
        }`}
      >
        <Sidebar
          view={view}
          onNav={setView}
          onWrite={() => openComposer()}
          verified={me.verified}
          onVerify={onVerify}
        />

        <main className="min-w-0">
          {view === "feed" && (
            <header className="reveal mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-pine">
                  {campus} · {today}
                </p>
                <h1 className="mt-1.5 flex items-center gap-3 font-display text-3xl font-extrabold tracking-tight sm:text-[2.75rem] sm:leading-[1.05]">
                  {greeting()}, {me.name.split(" ")[0]}
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
              onCategory={(c) => {
                setQuery("");
                setTab("For You");
                setCategory(c);
              }}
              query={query}
              onClearQuery={() => setQuery("")}
              onOpen={setActivePostId}
              onLike={onLike}
              onUseful={onUseful}
              onSave={onSave}
              onShare={onShare}
              onVote={onVote}
              onReport={setReportFor}
              onTag={onTag}
              onShareNotice={onShareNotice}
              onWrite={() => openComposer()}
            />
          )}
          {view === "discover" && (
            <DiscoverView follows={follows} onFollow={onFollow} joined={joined} onJoin={onJoin} notify={notify} onShareNotice={onShareNotice} />
          )}
          {view === "events" && <EventsView rsvps={rsvps} onRsvp={onRsvp} notify={notify} campus={campus} />}
          {view === "market" && <MarketView notify={notify} />}
          {view === "studio" && (
            <StudioView
              notify={notify}
              drafts={drafts}
              onEditDraft={onEditDraft}
              onDeleteDraft={onDeleteDraft}
              me={me}
              school={session.school}
            />
          )}
        </main>

        {view === "feed" && (
          <RightRail
            rsvps={rsvps}
            onRsvp={onRsvp}
            follows={follows}
            onFollow={onFollow}
            onTopic={onTopic}
            onNav={setView}
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
              <button key={l} onClick={() => setInfoTopic(l)} className="transition-colors hover:text-gold">
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
          onReport={onReportFromDetail}
          onTag={onTag}
          me={me}
        />
      )}
      {composerOpen && (
        <Composer
          onClose={() => setComposerOpen(false)}
          onPublish={onPublish}
          onSaveDraft={onSaveDraft}
          notify={notify}
          initial={composerInitial}
          author={me}
        />
      )}
      {reportPost && (
        <ReportModal
          target={reportPost.title.length > 40 ? `${reportPost.title.slice(0, 40)}…` : reportPost.title}
          onClose={() => setReportFor(null)}
          onSubmit={onReportSubmit}
        />
      )}
      {infoTopic && <InfoModal topic={infoTopic} onClose={() => setInfoTopic(null)} />}

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
