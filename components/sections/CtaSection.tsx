import { Button } from "@/components/ui/Button";
import { bookHref } from "@/lib/site-config";

export function CtaSection() {
  return (
    <section className="border-t border-[var(--border)] bg-[var(--bg-elevated)] py-16 md:py-20">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--cream)] md:text-3xl">
          Plan your event with KOT
        </h2>
        <p className="mt-4 text-base leading-relaxed text-[var(--muted)]">
          Tell us about your occasion and we&apos;ll follow up with availability,
          menu direction, and next steps — usually within 24–48 hours.
        </p>
        <div className="mt-8">
          <Button href={bookHref} size="lg">
            Request a consultation
          </Button>
        </div>
      </div>
    </section>
  );
}
