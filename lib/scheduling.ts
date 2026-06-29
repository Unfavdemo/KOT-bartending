import { siteConfig } from "@/lib/site-config";

export const SCHEDULE = {
  timezone: "America/New_York",
  timezoneLabel: "ET",
  durationMinutes: 30,
  daysAhead: 21,
  /** 1 = Mon … 6 = Sat */
  weekdays: [1, 2, 3, 4, 5, 6] as const,
  /** 24h HH:mm in studio timezone */
  slots: ["10:00", "11:00", "13:00", "14:00", "15:00", "16:00"] as const,
  /** Earliest bookable slot is this many business days from today */
  minLeadBusinessDays: 2,
} as const;

export type ScheduleSlot = {
  date: string;
  time: string;
  label: string;
  weekday: string;
};

const weekdayFmt = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  timeZone: SCHEDULE.timezone,
});

const dateFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: SCHEDULE.timezone,
});

export function slotInstant(date: string, time: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);

  let utc = Date.UTC(year, month - 1, day, hour, minute);
  for (let i = 0; i < 2; i++) {
    const dtf = new Intl.DateTimeFormat("en-US", {
      timeZone: SCHEDULE.timezone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    const parts = Object.fromEntries(
      dtf.formatToParts(new Date(utc)).map((p) => [p.type, p.value]),
    );
    const asUtc = Date.UTC(
      Number(parts.year),
      Number(parts.month) - 1,
      Number(parts.day),
      Number(parts.hour),
      Number(parts.minute),
    );
    utc += Date.UTC(year, month - 1, day, hour, minute) - asUtc;
  }
  return new Date(utc);
}

export function formatTime12(time: string): string {
  const [hh, mm] = time.split(":").map(Number);
  const h12 = hh % 12 || 12;
  const ampm = hh >= 12 ? "PM" : "AM";
  return `${h12}:${String(mm).padStart(2, "0")} ${ampm}`;
}

function isWeekday(date: Date): boolean {
  const day = date.getDay();
  return (SCHEDULE.weekdays as readonly number[]).includes(day);
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getAvailableDates(): { date: string; weekday: string; label: string }[] {
  const results: { date: string; weekday: string; label: string }[] = [];
  let cursor = new Date();
  let businessDaysSkipped = 0;

  while (results.length < SCHEDULE.daysAhead) {
    cursor = addDays(cursor, 1);
    if (!isWeekday(cursor)) continue;

    businessDaysSkipped += 1;
    if (businessDaysSkipped < SCHEDULE.minLeadBusinessDays) continue;

    const date = toDateKey(cursor);
    results.push({
      date,
      weekday: weekdayFmt.format(cursor),
      label: dateFmt.format(cursor),
    });
  }

  return results;
}

export function formatSlotLabel(date: string, time: string): string {
  const instant = slotInstant(date, time);
  return `${weekdayFmt.format(instant)}, ${dateFmt.format(instant)} · ${formatTime12(time)} ${SCHEDULE.timezoneLabel}`;
}

export function buildIcsEvent(input: {
  name: string;
  email: string;
  date: string;
  time: string;
  note?: string;
}): string {
  const start = slotInstant(input.date, input.time);
  const end = new Date(start.getTime() + SCHEDULE.durationMinutes * 60_000);

  const stamp = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");

  const uid = `kot-planning-${input.date}-${input.time}-${Date.now()}@kittyontopbartending.com`;
  const description = [
    `Event planning call with ${input.name} (${input.email})`,
    input.note ? `\nNote: ${input.note}` : "",
  ].join("");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${siteConfig.shortName}//Schedule//EN`,
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${siteConfig.name} — Planning call with ${input.name}`,
    `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
    "LOCATION:Phone or video — details sent after confirmation",
    `ORGANIZER;CN=${siteConfig.name}:mailto:${siteConfig.email}`,
    `ATTENDEE;CN=${input.name};RSVP=TRUE:mailto:${input.email}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export type ScheduleRequest = {
  name: string;
  email: string;
  date: string;
  time: string;
  note?: string;
};

export function isValidScheduleRequest(body: ScheduleRequest): boolean {
  if (!body.name?.trim() || !body.email?.trim()) return false;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) return false;
  if (!body.date || !body.time) return false;

  const dates = getAvailableDates().map((d) => d.date);
  if (!dates.includes(body.date)) return false;
  if (!(SCHEDULE.slots as readonly string[]).includes(body.time)) return false;

  return true;
}
