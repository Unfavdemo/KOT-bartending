"use client";

import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { bookHref } from "@/lib/site-config";

export function CtaSection() {
  return (
    <section className="mesh-citrus relative overflow-hidden border-t border-[var(--border)] py-20">
      <Reveal className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--orange)]">
          Ready when you are
        </p>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold uppercase text-[var(--cream)] md:text-4xl">
          Let&apos;s Create Something Memorable
        </h2>
        <p className="mt-4 text-[var(--muted)]">
          When you&apos;re ready to plan your event, we&apos;re here. Explore our
          shop, join the community board, or book a consultation — on your timeline.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href={bookHref} size="lg">
            Book an Event
          </Button>
          <Button href="/shop" variant="secondary" size="lg">
            Shop Syrups
          </Button>
          <Button href="/community" variant="outline" size="lg">
            Community Board
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
