"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import { SCHEDULE, formatTime12 } from "@/lib/scheduling";
import type { ScheduleBooking } from "@/lib/schedule-data";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type ScheduleAdminProps = {
  onMessage: (msg: string) => void;
};

export function ScheduleAdmin({ onMessage }: ScheduleAdminProps) {
  const [bookings, setBookings] = useState<ScheduleBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [blockDate, setBlockDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [blockTime, setBlockTime] = useState<string>(SCHEDULE.slots[0]);
  const [blockLabel, setBlockLabel] = useState("Unavailable");

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/api/schedule/admin");
      if (!res.ok) throw new Error("fetch failed");
      setBookings(await res.json());
    } catch {
      onMessage("Could not load schedule bookings.");
    } finally {
      setLoading(false);
    }
  }, [onMessage]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const pending = useMemo(
    () => bookings.filter((b) => b.kind === "consultation" && b.status === "pending"),
    [bookings],
  );

  const upcoming = useMemo(
    () =>
      [...bookings]
        .filter((b) => b.status !== "pending")
        .sort((a, b) => `${b.slotDate}${b.slotTime}`.localeCompare(`${a.slotDate}${a.slotTime}`)),
    [bookings],
  );

  async function blockSlot(e: React.FormEvent) {
    e.preventDefault();
    const res = await adminFetch("/api/schedule/admin", {
      method: "POST",
      body: JSON.stringify({
        action: "block",
        date: blockDate,
        time: blockTime,
        label: blockLabel,
      }),
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      onMessage(data.error ?? "Failed to block slot.");
      return;
    }
    onMessage("Slot blocked on the public calendar.");
    void refresh();
  }

  async function setStatus(id: string, status: ScheduleBooking["status"]) {
    const res = await adminFetch("/api/schedule/admin", {
      method: "PATCH",
      body: JSON.stringify({ id, status }),
    });
    if (!res.ok) {
      onMessage("Failed to update booking.");
      return;
    }
    onMessage(`Booking marked ${status}.`);
    void refresh();
  }

  async function removeBooking(id: string) {
    const res = await adminFetch(`/api/schedule/admin?id=${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      onMessage("Failed to cancel booking.");
      return;
    }
    onMessage("Booking cancelled — slot is open again.");
    void refresh();
  }

  return (
    <section className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold uppercase text-[var(--cream)]">
            Planning calendar
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Confirm new calls, manage blocked time, and keep the public calendar accurate.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={loading}
          className="text-sm text-[var(--muted)] hover:text-[var(--orange)]"
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </header>

      {pending.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--orange)]">
            Needs confirmation ({pending.length})
          </p>
          <ul className="card-kot divide-y divide-[var(--border)] overflow-hidden rounded-xl border-[var(--border-orange)]">
            {pending.map((b) => (
              <BookingRow
                key={b.id}
                booking={b}
                highlight
                onConfirm={() => void setStatus(b.id, "confirmed")}
                onCancel={() => void removeBooking(b.id)}
              />
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
            All entries
          </p>
          <ul className="card-kot divide-y divide-[var(--border)] overflow-hidden rounded-xl">
            {upcoming.length === 0 && pending.length === 0 ? (
              <li className="px-5 py-10 text-center text-sm text-[var(--muted)]">
                No bookings yet — open slots will appear here once clients book.
              </li>
            ) : (
              upcoming.map((b) => (
                <BookingRow
                  key={b.id}
                  booking={b}
                  onConfirm={
                    b.status === "pending"
                      ? () => void setStatus(b.id, "confirmed")
                      : undefined
                  }
                  onCancel={() => void removeBooking(b.id)}
                />
              ))
            )}
          </ul>
        </div>

        <form onSubmit={blockSlot} className="card-kot h-fit space-y-4 rounded-xl p-6">
          <div>
            <h3 className="text-sm font-semibold text-[var(--cream)]">Block a slot</h3>
            <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
              Mark time as unavailable on the public booking calendar.
            </p>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Date
            </label>
            <input
              type="date"
              value={blockDate}
              onChange={(e) => setBlockDate(e.target.value)}
              className="kot-input mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Time
            </label>
            <select
              value={blockTime}
              onChange={(e) => setBlockTime(e.target.value)}
              className="kot-input mt-1"
            >
              {SCHEDULE.slots.map((t) => (
                <option key={t} value={t}>
                  {formatTime12(t)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Public label
            </label>
            <input
              value={blockLabel}
              onChange={(e) => setBlockLabel(e.target.value)}
              placeholder="Unavailable"
              className="kot-input mt-1"
            />
          </div>
          <Button type="submit" className="w-full">
            Block slot
          </Button>
        </form>
      </div>
    </section>
  );
}

function BookingRow({
  booking: b,
  highlight,
  onConfirm,
  onCancel,
}: {
  booking: ScheduleBooking;
  highlight?: boolean;
  onConfirm?: () => void;
  onCancel: () => void;
}) {
  return (
    <li
      className={cn(
        "flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between",
        highlight && "bg-[var(--orange)]/5",
      )}
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[var(--cream)]">
          {b.slotDate} · {formatTime12(b.slotTime)}
        </p>
        <p className="mt-1 text-xs text-[var(--muted)]">
          {b.kind === "consultation" && b.name ? (
            <>
              {b.name} · {b.email}
            </>
          ) : (
            <>Blocked · {b.label}</>
          )}
        </p>
        {b.note && (
          <p className="mt-1 text-xs italic text-[var(--muted)]">&ldquo;{b.note}&rdquo;</p>
        )}
        <span
          className={cn(
            "mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
            b.status === "pending" && "bg-[var(--yellow)]/15 text-[var(--yellow)]",
            b.status === "confirmed" && "bg-[var(--orange)]/15 text-[var(--orange)]",
            b.status === "blocked" && "bg-[var(--surface)] text-[var(--muted)]",
          )}
        >
          {b.status}
        </span>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        {onConfirm && (
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg border border-[var(--border-orange)] bg-[var(--orange)]/10 px-3 py-1.5 text-xs font-medium text-[var(--orange)] hover:bg-[var(--orange)]/20"
          >
            Confirm
          </button>
        )}
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] hover:border-red-400/40 hover:text-red-400"
        >
          Cancel
        </button>
      </div>
    </li>
  );
}
