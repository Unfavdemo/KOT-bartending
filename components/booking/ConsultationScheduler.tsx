"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AddToCalendar } from "@/components/booking/AddToCalendar";
import { Button } from "@/components/ui/Button";
import { siteConfig, bookQuoteHref } from "@/lib/site-config";
import type { OccupiedSlot } from "@/lib/schedule-data";
import {
  SCHEDULE,
  formatSlotLabel,
  formatTime12,
} from "@/lib/scheduling";
import { cn } from "@/lib/utils";

type FormState = {
  name: string;
  email: string;
  note: string;
};

type Availability = {
  dates: { date: string; weekday: string; label: string }[];
  occupied: Record<string, OccupiedSlot[]>;
};

function getOccupiedMap(
  occupied: Record<string, OccupiedSlot[]>,
  date: string,
  time: string,
): OccupiedSlot | undefined {
  return occupied[date]?.find((s) => s.time === time);
}

function firstOpenSlot(
  date: string,
  occupied: Record<string, OccupiedSlot[]>,
): string | undefined {
  return SCHEDULE.slots.find((time) => !getOccupiedMap(occupied, date, time));
}

type ConsultationSchedulerProps = {
  onStepChange?: (step: number) => void;
};

export function ConsultationScheduler({ onStepChange }: ConsultationSchedulerProps) {
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [loadingAvailability, setLoadingAvailability] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [form, setForm] = useState<FormState>({ name: "", email: "", note: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<{
    label: string;
    ics: string;
    date: string;
    time: string;
    name: string;
    email: string;
    note?: string;
  } | null>(null);

  const loadAvailability = useCallback(async () => {
    try {
      const res = await fetch("/api/schedule");
      if (!res.ok) throw new Error("fetch failed");
      const data = (await res.json()) as Availability;
      setAvailability(data);
    } catch {
      setError(`Could not load availability. Email ${siteConfig.email} to book.`);
    } finally {
      setLoadingAvailability(false);
    }
  }, []);

  useEffect(() => {
    void loadAvailability();
    const interval = setInterval(() => void loadAvailability(), 30_000);
    return () => clearInterval(interval);
  }, [loadAvailability]);

  const dates = availability?.dates ?? [];
  const occupied = availability?.occupied ?? {};

  useEffect(() => {
    if (!dates.length) return;
    if (!selectedDate || !dates.some((d) => d.date === selectedDate)) {
      setSelectedDate(dates[0].date);
    }
  }, [dates, selectedDate]);

  useEffect(() => {
    if (!selectedDate) return;
    const open = firstOpenSlot(selectedDate, occupied);
    const currentTaken = selectedTime
      ? getOccupiedMap(occupied, selectedDate, selectedTime)
      : true;
    if (!selectedTime || currentTaken) {
      setSelectedTime(open ?? "");
    }
  }, [selectedDate, occupied, selectedTime]);

  const openCountForDate = useMemo(() => {
    return (date: string) =>
      SCHEDULE.slots.filter((t) => !getOccupiedMap(occupied, date, t)).length;
  }, [occupied]);

  useEffect(() => {
    if (confirmed) {
      onStepChange?.(1);
      return;
    }
    if (selectedDate && selectedTime) onStepChange?.(1);
    else onStepChange?.(0);
  }, [selectedDate, selectedTime, confirmed, onStepChange]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      setError("Pick an available time slot.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          date: selectedDate,
          time: selectedTime,
          note: form.note.trim() || undefined,
        }),
      });

      const data = (await res.json()) as {
        error?: string;
        slotLabel?: string;
        ics?: string;
      };

      if (!res.ok) {
        setError(data.error ?? "Could not submit request. Try again or email us.");
        if (res.status === 409) void loadAvailability();
        return;
      }

      setConfirmed({
        label: data.slotLabel ?? formatSlotLabel(selectedDate, selectedTime),
        ics: data.ics ?? "",
        date: selectedDate,
        time: selectedTime,
        name: form.name.trim(),
        email: form.email.trim(),
        note: form.note.trim() || undefined,
      });
      void loadAvailability();
    } catch {
      setError(`Something went wrong. Email ${siteConfig.email} to book directly.`);
    } finally {
      setLoading(false);
    }
  }

  if (loadingAvailability) {
    return (
      <div className="card-kot rounded-xl p-10 text-center text-sm text-[var(--muted)]">
        Loading availability…
      </div>
    );
  }

  if (confirmed) {
    return (
      <div className="card-kot rounded-xl p-8 text-center md:p-10">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--orange)]">
          Slot held
        </p>
        <h3 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-bold uppercase text-[var(--cream)]">
          You&apos;re on the calendar
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
          <strong className="text-[var(--cream)]">{confirmed.label}</strong> is reserved
          for you. We&apos;ll send a confirmation email shortly with next steps.
        </p>
        <AddToCalendar
          name={confirmed.name}
          email={confirmed.email}
          date={confirmed.date}
          time={confirmed.time}
          note={confirmed.note}
          ics={confirmed.ics}
        />
        <div className="mt-8 border-t border-[var(--border)] pt-6">
          <p className="text-sm text-[var(--muted)]">
            Ready to share more details? Submit a full event inquiry next.
          </p>
          <Button href={bookQuoteHref} variant="outline" className="mt-4">
            Request a quote
          </Button>
        </div>
      </div>
    );
  }

  const selectedOpen = selectedDate ? openCountForDate(selectedDate) : 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="card-kot overflow-hidden rounded-xl lg:grid lg:grid-cols-2 lg:items-start"
    >
      <div className="border-b border-[var(--border)] bg-[var(--bg-elevated)] p-5 sm:p-6 lg:border-b-0 lg:border-r lg:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--orange)]">
          Step 1
        </p>
        <p className="mt-1 text-sm font-semibold text-[var(--cream)]">Pick a date</p>
        <p className="mt-1 text-[11px] text-[var(--muted)] sm:hidden">Swipe for more dates →</p>
        <div className="mt-3 -mx-1 flex gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:thin]">
          {dates.map((d) => {
            const active = selectedDate === d.date;
            const open = openCountForDate(d.date);
            const full = open === 0;
            return (
              <button
                key={d.date}
                type="button"
                onClick={() => setSelectedDate(d.date)}
                className={cn(
                  "shrink-0 rounded-lg border px-4 py-3 text-left transition-all",
                  active
                    ? "border-[var(--orange)] bg-[var(--orange)] text-black"
                    : full
                      ? "border-[var(--border)] bg-[var(--surface)]/60 text-[var(--muted)]"
                      : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-orange)]",
                )}
              >
                <p className="text-[10px] font-medium uppercase tracking-wider opacity-80">
                  {d.weekday}
                </p>
                <p className="mt-0.5 text-sm font-semibold">{d.label}</p>
                <p
                  className={cn(
                    "mt-1 text-[10px]",
                    active ? "text-black/70" : "text-[var(--muted)]",
                  )}
                >
                  {full ? "Full" : `${open} open`}
                </p>
              </button>
            );
          })}
        </div>

        <p className="mt-8 text-sm font-semibold text-[var(--cream)]">Pick a time</p>
        <p className="mt-1 text-xs text-[var(--muted)]">
          30 min · {SCHEDULE.timezoneLabel} · Unavailable slots are already booked
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
          {SCHEDULE.slots.map((time) => {
            const taken = getOccupiedMap(occupied, selectedDate, time);
            const active = selectedTime === time && !taken;
            const label = formatTime12(time);
            return (
              <button
                key={time}
                type="button"
                disabled={Boolean(taken)}
                onClick={() => setSelectedTime(time)}
                title={taken ? taken.label : undefined}
                className={cn(
                  "rounded-lg border px-3 py-2.5 text-sm font-medium transition-all",
                  taken
                    ? "cursor-not-allowed border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--muted)]/60"
                    : active
                      ? "border-[var(--orange)] bg-[var(--orange)] text-black"
                      : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-orange)] text-[var(--cream)]",
                )}
              >
                <span className={taken ? "line-through decoration-white/20" : ""}>
                  {label}
                </span>
                {taken && (
                  <span className="mt-0.5 block text-[10px] font-normal normal-case tracking-normal opacity-80">
                    {taken.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {selectedOpen === 0 && (
          <p className="mt-4 text-xs text-[var(--orange)]">
            No open slots this day — try another date.
          </p>
        )}
      </div>

      <div className="p-5 pb-8 sm:p-6 lg:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--orange)]">
          Step 2
        </p>
        <p className="mt-1 text-sm font-semibold text-[var(--cream)]">Your details</p>
        {selectedDate && selectedTime && (
          <p className="mt-2 rounded-lg bg-[var(--bg-elevated)] px-3 py-2 text-xs text-[var(--muted)]">
            {formatSlotLabel(selectedDate, selectedTime)}
          </p>
        )}

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="schedule-name" className="text-xs font-semibold text-[var(--muted)]">
              Name
            </label>
            <input
              id="schedule-name"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="kot-input mt-1"
            />
          </div>
          <div>
            <label htmlFor="schedule-email" className="text-xs font-semibold text-[var(--muted)]">
              Email
            </label>
            <input
              id="schedule-email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="kot-input mt-1"
            />
          </div>
          <div>
            <label htmlFor="schedule-note" className="text-xs font-semibold text-[var(--muted)]">
              Note <span className="font-normal">(optional)</span>
            </label>
            <textarea
              id="schedule-note"
              rows={2}
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              placeholder="Tell us about your event…"
              className="kot-input mt-1 resize-none"
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="mt-6 w-full"
          disabled={loading || !selectedTime || selectedOpen === 0}
        >
          {loading ? "Booking…" : "Book planning call"}
        </Button>
        <p className="mt-3 text-center text-[11px] leading-relaxed text-[var(--muted)]">
          Open slots update live. Your time is held immediately once booked.
        </p>
      </div>
    </form>
  );
}
