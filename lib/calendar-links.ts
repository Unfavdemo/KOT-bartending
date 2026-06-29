import { siteConfig } from "@/lib/site-config";
import { SCHEDULE, buildIcsEvent, slotInstant } from "@/lib/scheduling";

export type CalendarEventInput = {
  name: string;
  email: string;
  date: string;
  time: string;
  note?: string;
};

export type CalendarLinks = {
  google: string;
  outlook: string;
  yahoo: string;
  ics: string;
  title: string;
  slotLabel: string;
};

function addMinutes(date: string, time: string, minutes: number): string {
  const start = slotInstant(date, time);
  const end = new Date(start.getTime() + minutes * 60_000);
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: SCHEDULE.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(
    dtf.formatToParts(end).map((p) => [p.type, p.value]),
  );
  return `${parts.year}${parts.month}${parts.day}T${parts.hour}${parts.minute}${parts.second}`;
}

function formatLocalStamp(date: string, time: string): string {
  const [y, m, d] = date.split("-");
  const [hh, mm] = time.split(":");
  return `${y}${m}${d}T${hh}${mm}00`;
}

function encode(params: Record<string, string>): string {
  return new URLSearchParams(params).toString();
}

export function buildCalendarLinks(input: CalendarEventInput): CalendarLinks {
  const title = `${siteConfig.shortName} — Event planning call`;
  const description = [
    `30-minute planning call with ${siteConfig.name}.`,
    input.note ? `\nYour note: ${input.note}` : "",
    `\nQuestions? ${siteConfig.email}`,
  ]
    .join("")
    .trim();
  const location = "Phone or video — details sent after confirmation";

  const startLocal = formatLocalStamp(input.date, input.time);
  const endLocal = addMinutes(input.date, input.time, SCHEDULE.durationMinutes);

  const start = slotInstant(input.date, input.time);
  const end = new Date(start.getTime() + SCHEDULE.durationMinutes * 60_000);

  const google = `https://calendar.google.com/calendar/render?${encode({
    action: "TEMPLATE",
    text: title,
    dates: `${startLocal}/${endLocal}`,
    details: description,
    location,
    ctz: SCHEDULE.timezone,
  })}`;

  const outlook = `https://outlook.live.com/calendar/0/deeplink/compose?${encode({
    subject: title,
    body: description,
    location,
    startdt: start.toISOString(),
    enddt: end.toISOString(),
  })}`;

  const yahoo = `https://calendar.yahoo.com/?${encode({
    v: "60",
    title,
    st: startLocal,
    et: endLocal,
    desc: description,
    in_loc: location,
  })}`;

  const ics = buildIcsEvent(input);

  return {
    google,
    outlook,
    yahoo,
    ics,
    title,
    slotLabel: `${input.date} ${input.time}`,
  };
}

export function downloadIcsFile(ics: string, filename = "kot-planning-call.ics") {
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
