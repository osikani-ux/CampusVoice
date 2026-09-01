import type { CampusEvent } from "../data";

const MONTHS: Record<string, string> = {
  JAN: "01", FEB: "02", MAR: "03", APR: "04", MAY: "05", JUN: "06",
  JUL: "07", AUG: "08", SEP: "09", OCT: "10", NOV: "11", DEC: "12",
};

/** "7:00 PM" -> "190000" */
function toICSTime(t: string): string {
  const m = t.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!m) return "120000";
  let h = parseInt(m[1], 10);
  const min = m[2];
  const mer = m[3].toUpperCase();
  if (mer === "PM" && h !== 12) h += 12;
  if (mer === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}${min}00`;
}

/** Builds and downloads a real .ics file for a campus event. */
export function downloadICS(e: CampusEvent, campus: string): void {
  const mm = MONTHS[e.month] ?? "09";
  const dd = e.day.padStart(2, "0");
  const start = toICSTime(e.time);
  const startHour = parseInt(start.slice(0, 2), 10);
  const end = `${String(Math.min(startHour + 2, 23)).padStart(2, "0")}${start.slice(2)}`;
  const dtstart = `2026${mm}${dd}T${start}`;
  const dtend = `2026${mm}${dd}T${end}`;
  const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CampusVoice//Events//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${e.id}-${dtstart}@campusvoice.app`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    `SUMMARY:${e.title} — CampusVoice`,
    `LOCATION:${e.venue}\\, ${campus}`,
    `DESCRIPTION:${e.tag} event at ${campus}. RSVP'd via CampusVoice.`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${e.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
