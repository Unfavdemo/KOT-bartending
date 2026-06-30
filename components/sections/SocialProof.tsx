"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { testimonials } from "@/lib/testimonials";

export function SocialProof() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="border-y border-[var(--border)] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Client feedback"
          title="What hosts are saying"
          align="center"
          className="mb-12"
        />

        <div className="relative mx-auto max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={current}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="text-center"
            >
              <p className="text-lg leading-relaxed text-[var(--cream)] md:text-xl">
                &ldquo;{testimonials[current].quote}&rdquo;
              </p>
              {testimonials[current].author && (
                <footer className="mt-5 text-sm text-[var(--muted)]">
                  — {testimonials[current].author}
                </footer>
              )}
            </motion.blockquote>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() =>
                setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)
              }
              className="touch-target rounded-lg border border-[var(--border)] text-[var(--muted)] transition-colors hover:border-[var(--orange)] hover:text-[var(--orange)]"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-1">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrent(i)}
                  className="touch-target rounded-full"
                  aria-label={`Go to testimonial ${i + 1}`}
                >
                  <span
                    className={`block h-2 w-2 rounded-full transition-colors ${
                      i === current ? "bg-[var(--orange)]" : "bg-[var(--border)]"
                    }`}
                  />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setCurrent((c) => (c + 1) % testimonials.length)}
              className="touch-target rounded-lg border border-[var(--border)] text-[var(--muted)] transition-colors hover:border-[var(--orange)] hover:text-[var(--orange)]"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
