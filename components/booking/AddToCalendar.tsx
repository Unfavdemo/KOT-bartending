"use client";

import { buildCalendarLinks, downloadIcsFile } from "@/lib/calendar-links";

type AddToCalendarProps = {
  name: string;
  email: string;
  date: string;
  time: string;
  note?: string;
  ics?: string;
};

const OPTIONS = [
  {
    id: "google" as const,
    label: "Google Calendar",
    hint: "Opens in browser",
    icon: "G",
  },
  {
    id: "outlook" as const,
    label: "Outlook",
    hint: "Microsoft 365 & Outlook.com",
    icon: "O",
  },
  {
    id: "yahoo" as const,
    label: "Yahoo Calendar",
    hint: "Add directly online",
    icon: "Y",
  },
  {
    id: "apple" as const,
    label: "Apple Calendar",
    hint: "Download .ics file",
    icon: "",
  },
];

export function AddToCalendar({
  name,
  email,
  date,
  time,
  note,
  ics: icsOverride,
}: AddToCalendarProps) {
  const links = buildCalendarLinks({ name, email, date, time, note });
  const ics = icsOverride ?? links.ics;

  function handleSelect(id: (typeof OPTIONS)[number]["id"]) {
    if (id === "google") {
      window.open(links.google, "_blank", "noopener,noreferrer");
      return;
    }
    if (id === "outlook") {
      window.open(links.outlook, "_blank", "noopener,noreferrer");
      return;
    }
    if (id === "yahoo") {
      window.open(links.yahoo, "_blank", "noopener,noreferrer");
      return;
    }
    downloadIcsFile(ics);
  }

  return (
    <div className="mt-8 text-left">
      <p className="text-center text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
        Add to your calendar
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => handleSelect(option.id)}
            className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-left transition hover:border-[var(--border-orange)]"
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                option.id === "apple"
                  ? "bg-[var(--orange)] text-black"
                  : "bg-[var(--bg-elevated)] text-[var(--cream)]"
              }`}
              aria-hidden
            >
              {option.id === "apple" ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
              ) : (
                option.icon
              )}
            </span>
            <span>
              <span className="block text-sm font-semibold text-[var(--cream)]">
                {option.label}
              </span>
              <span className="block text-[11px] text-[var(--muted)]">{option.hint}</span>
            </span>
          </button>
        ))}
      </div>
      <p className="mt-4 text-center text-[11px] text-[var(--muted)]">
        Apple Calendar and other apps use the downloaded .ics file.
      </p>
    </div>
  );
}
