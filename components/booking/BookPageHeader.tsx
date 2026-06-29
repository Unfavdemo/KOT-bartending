import { siteConfig } from "@/lib/site-config";

export function BookPageHeader() {
  return (
    <header className="relative overflow-hidden bg-[var(--bg-elevated)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--orange)]/50 to-transparent" />
      <div className="absolute -right-32 top-0 h-72 w-72 rounded-full bg-[var(--orange)]/10 blur-3xl" />
      <div className="absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-[var(--yellow)]/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-12 md:pb-16 md:pt-16 sm:px-6 lg:px-8">
        <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[var(--orange)]">
          Book your event
        </p>
        <h2
          id="book-section-title"
          className="max-w-3xl font-[family-name:var(--font-display)] text-[clamp(2rem,4.5vw,3.25rem)] font-bold uppercase leading-tight tracking-tight text-[var(--cream)]"
        >
          Submit your event brief
        </h2>
        <p className="body-lead mt-5 max-w-2xl text-base leading-relaxed text-[var(--muted)] md:text-lg">
          Tell us about your celebration. On submit, our team will review your details
          and respond within 24–48 hours — or email{" "}
          <a
            href={`mailto:${siteConfig.email}`}
            className="font-medium text-[var(--orange)] transition-colors hover:text-[var(--yellow)]"
          >
            {siteConfig.email}
          </a>{" "}
          directly.
        </p>
      </div>
    </header>
  );
}
