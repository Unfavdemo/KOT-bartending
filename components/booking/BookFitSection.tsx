import { BOOKING_GOOD_FIT, BOOKING_NOT_FIT } from "@/lib/booking-content";

export function BookFitSection() {
  return (
    <section className="mx-auto mt-16 max-w-4xl md:mt-20">
      <div className="grid gap-10 md:grid-cols-2 md:gap-12">
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-wider text-[var(--yellow)]">
            Good fit if…
          </p>
          <ul className="space-y-3">
            {BOOKING_GOOD_FIT.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--muted)]"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--orange)]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
            Probably not if…
          </p>
          <ul className="space-y-3">
            {BOOKING_NOT_FIT.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--muted)]"
              >
                <span className="mt-2 h-px w-3 shrink-0 bg-[var(--border)]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
