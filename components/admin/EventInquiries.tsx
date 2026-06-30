"use client";

import { useCallback, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
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
  const [pendingDelete, setPendingDelete] = useState<EventInquiry | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      const res = await adminFetch(`/api/admin/inquiries?id=${pendingDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        onMessage("Could not delete this inquiry.");
        return;
      }
      onMessage(`Removed inquiry from ${pendingDelete.name}.`);
      setPendingDelete(null);
      void refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
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
                  <div className="min-w-0 flex-1">
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
                  <div className="flex shrink-0 items-center gap-2">
                    {inquiry.eventType && (
                      <span className="rounded-full border border-[var(--border-orange)] bg-[var(--orange)]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--orange)]">
                        {eventTypeLabels[inquiry.eventType] ?? inquiry.eventType}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setPendingDelete(inquiry)}
                      className="touch-target rounded-lg border border-[var(--border)] text-[var(--muted)] transition-colors hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-400"
                      aria-label={`Delete inquiry from ${inquiry.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
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

      <ConfirmDialog
        open={pendingDelete != null}
        title="Delete this inquiry?"
        description={
          pendingDelete
            ? `This permanently removes ${pendingDelete.name}'s quote request (${pendingDelete.email}). This can't be undone.`
            : ""
        }
        confirmLabel="Delete inquiry"
        cancelLabel="Keep inquiry"
        loading={deleting}
        variant="danger"
        onCancel={() => !deleting && setPendingDelete(null)}
        onConfirm={() => void confirmDelete()}
      />
    </>
  );
}
