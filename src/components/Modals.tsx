import { useState } from "react";
import type { ReactNode } from "react";
import { CloseIcon, Flag } from "./icons";

/** Shared modal shell — dark scrim, stamped panel, varsity borders. */
export function ModalShell({
  title, kicker, onClose, children, wide,
}: {
  title: string;
  kicker: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-ink/70 p-4 sm:p-8" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className={`toast-in mx-auto ${wide ? "max-w-xl" : "max-w-md"} rounded-xl border-2 border-ink bg-paper shadow-block`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3 border-b-2 border-ink bg-card px-5 py-4">
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-pine">{kicker}</p>
            <p className="mt-0.5 font-display text-lg font-extrabold leading-tight">{title}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto grid h-8 w-8 shrink-0 place-items-center rounded-lg border-2 border-ink/25 transition-all hover:border-ink hover:bg-gold/25"
            aria-label="Close dialog"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

/* ---------------- Report modal ---------------- */

const REPORT_REASONS = [
  "Harassment or bullying",
  "False information",
  "Hate speech",
  "Sexual content",
  "Scam or fraud",
  "Spam",
  "Personal information (doxxing)",
  "Something else",
];

export function ReportModal({
  target, onClose, onSubmit,
}: {
  target: string;
  onClose: () => void;
  onSubmit: (reason: string, details: string) => void;
}) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");

  return (
    <ModalShell title={`Report: ${target}`} kicker="CampusVoice Trust & Safety" onClose={onClose}>
      <p className="text-sm leading-relaxed text-ink-soft">
        Reports go straight to the campus moderation team. They review within 24 hours and your name is never shared with the author.
      </p>
      <div className="mt-4 grid gap-2">
        {REPORT_REASONS.map((r) => (
          <button
            key={r}
            onClick={() => setReason(r)}
            className={`flex items-center gap-2.5 rounded-lg border-2 px-3.5 py-2.5 text-left text-sm font-semibold transition-all ${
              reason === r ? "border-ink bg-rasp/10 text-rasp" : "border-ink/25 bg-card hover:border-ink"
            }`}
          >
            <span
              className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border-2 ${
                reason === r ? "border-rasp" : "border-ink/30"
              }`}
            >
              {reason === r && <span className="h-2 w-2 rounded-full bg-rasp" />}
            </span>
            {r}
          </button>
        ))}
      </div>
      <textarea
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        rows={2}
        placeholder="Add context (optional)…"
        className="mt-3 w-full resize-none rounded-lg border-2 border-ink bg-card px-3.5 py-2.5 text-sm focus:bg-white focus:shadow-block-sm"
      />
      <div className="mt-4 flex gap-2">
        <button
          onClick={onClose}
          className="flex-1 rounded-lg border-2 border-ink bg-card px-4 py-2.5 font-display text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-block-sm active:translate-y-0"
        >
          Cancel
        </button>
        <button
          onClick={() => reason && onSubmit(reason, details)}
          disabled={!reason}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 px-4 py-2.5 font-display text-sm font-bold transition-all ${
            reason
              ? "border-ink bg-rasp text-white hover:-translate-y-0.5 hover:shadow-block active:translate-y-0"
              : "cursor-not-allowed border-ink/25 bg-card text-ink-soft"
          }`}
        >
          <Flag className="h-4 w-4" /> Submit report
        </button>
      </div>
    </ModalShell>
  );
}

/* ---------------- Info modal (footer links) ---------------- */

export function InfoModal({ topic, onClose }: { topic: string; onClose: () => void }) {
  return (
    <ModalShell title={topic} kicker="CampusVoice" onClose={onClose} wide>
      <p className="text-sm leading-relaxed text-ink-soft">{INFO_COPY[topic] ?? ""}</p>
      <button
        onClick={onClose}
        className="mt-5 w-full rounded-lg border-2 border-ink bg-gold px-4 py-2.5 font-display text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-block-sm active:translate-y-0"
      >
        Got it
      </button>
    </ModalShell>
  );
}

const INFO_COPY: Record<string, string> = {
  About:
    "CampusVoice is the digital community for university life — blogging plus a social feed, campus news, events, a marketplace and a creator economy, built for students and run on student voices. It started at Heritage Christian University in 2026 and now serves 47 campuses.",
  Guidelines:
    "Be honest, be useful, be kind. Cite your sources, label sponsored content, and keep anonymous stories anonymous. Harassment, defamation, doxxing, scams and false accusations are removed and can end your account. Three strikes and you're off the mic.",
  Safety:
    "Every post can be reported in two taps and is reviewed by campus moderators within 24 hours. Anonymous stories are stripped of identifying metadata before publishing. If you're ever in immediate danger, contact campus security first — CampusVoice is not an emergency service.",
  "For universities":
    "Universities get a verified official account, a dedicated announcement channel, event promotion, responsibly aggregated student-sentiment insights and moderation tooling. It's how administrations hear students before the rumour mill does. Email partners@campusvoice.app for a pilot.",
};
