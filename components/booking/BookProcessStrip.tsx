import { BOOKING_PROCESS } from "@/lib/booking-content";

export function BookProcessStrip() {
  return (
    <section className="mx-auto mt-20 max-w-4xl md:mt-28">
      <p className="mb-8 text-xs font-bold uppercase tracking-[0.2em] text-[var(--orange)]">
        How it works
      </p>
      <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {BOOKING_PROCESS.map((step) => (
          <li key={step.step}>
            <p className="font-mono text-xs text-[var(--yellow)]">{step.step}</p>
            <p className="mt-2 text-sm font-semibold text-[var(--cream)]">{step.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
