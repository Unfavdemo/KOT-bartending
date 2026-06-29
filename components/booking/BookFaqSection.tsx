import { BOOKING_FAQ } from "@/lib/booking-content";

export function BookFaqSection() {
  return (
    <section className="mx-auto mt-20 max-w-4xl border-t border-[var(--border)] pt-16 md:mt-28 md:pt-20">
      <p className="mb-8 text-xs font-bold uppercase tracking-[0.2em] text-[var(--orange)]">
        Common questions
      </p>
      <dl className="space-y-8">
        {BOOKING_FAQ.map((item) => (
          <div key={item.q}>
            <dt className="text-sm font-semibold text-[var(--cream)]">{item.q}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{item.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
