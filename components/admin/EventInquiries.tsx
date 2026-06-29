"use client";

import { useCallback, useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import type { EventInquiry } from "@/lib/inquiries-data";

type EventInquiriesProps = {
  onMessage: (msg: string) => void;
};

const eventTypeLabels: Record<string, string> = {
  private: "Private Party",
  corporate: "Corporate Event",
  class: "Cocktail Class",
};

export function EventInquiries({ onMessage }: EventInquiriesProps) {
  const [inquiries, setInquiries] = useState<EventInquiry[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/inquiries");
      if (!res.ok) throw new Error("fetch failed");
      setInquiries(await res.json());
    } catch {
      onMessage("Could not load event inquiries.");
    } finally {
      setLoading(false);
    }
  }, [onMessage]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <section className="space-y-6">
      <header>
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold uppercase text-[var(--cream)]">
          Event inquiries
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Full quote requests submitted through the booking wizard.
        </p>
      </header>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={loading}
          className="text-sm text-[var(--muted)] hover:text-[var(--orange)]"
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      <ul className="card-kot divide-y divide-[var(--border)] overflow-hidden rounded-xl">
        {inquiries.length === 0 ? (
          <li className="px-5 py-8 text-sm text-[var(--muted)]">No inquiries yet.</li>
        ) : (
          inquiries.map((inquiry) => (
            <li key={inquiry.id} className="px-5 py-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[var(--cream)]">
                    {inquiry.name}
                    <span className="ml-2 font-normal text-[var(--muted)]">
                      · {inquiry.email}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Submitted {new Date(inquiry.createdAt).toLocaleString()}
                  </p>
                </div>
                {inquiry.eventType && (
                  <span className="rounded-full border border-[var(--border-orange)] bg-[var(--orange)]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--orange)]">
                    {eventTypeLabels[inquiry.eventType] ?? inquiry.eventType}
                  </span>
                )}
              </div>
              <dl className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
                {inquiry.eventDate && (
                  <div>
                    <dt className="text-[var(--muted)]">Event date</dt>
                    <dd className="text-[var(--cream)]">{inquiry.eventDate}</dd>
                  </div>
                )}
                {inquiry.guestCount != null && (
                  <div>
                    <dt className="text-[var(--muted)]">Guests</dt>
                    <dd className="text-[var(--cream)]">{inquiry.guestCount}</dd>
                  </div>
                )}
                {inquiry.venue && (
                  <div className="sm:col-span-2">
                    <dt className="text-[var(--muted)]">Venue</dt>
                    <dd className="text-[var(--cream)]">{inquiry.venue}</dd>
                  </div>
                )}
                {inquiry.phone && (
                  <div>
                    <dt className="text-[var(--muted)]">Phone</dt>
                    <dd className="text-[var(--cream)]">{inquiry.phone}</dd>
                  </div>
                )}
                {inquiry.spiritPreferences.length > 0 && (
                  <div className="sm:col-span-2">
                    <dt className="text-[var(--muted)]">Spirits</dt>
                    <dd className="text-[var(--cream)]">
                      {inquiry.spiritPreferences.join(", ")}
                      {inquiry.spiritFree ? " · spirit-free options" : ""}
                    </dd>
                  </div>
                )}
                {inquiry.menuNotes && (
                  <div className="sm:col-span-2">
                    <dt className="text-[var(--muted)]">Menu notes</dt>
                    <dd className="text-[var(--cream)]">{inquiry.menuNotes}</dd>
                  </div>
                )}
                {inquiry.message && (
                  <div className="sm:col-span-2">
                    <dt className="text-[var(--muted)]">Message</dt>
                    <dd className="text-[var(--cream)]">{inquiry.message}</dd>
                  </div>
                )}
              </dl>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
