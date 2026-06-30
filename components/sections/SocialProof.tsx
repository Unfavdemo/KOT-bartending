"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { testimonials } from "@/lib/testimonials";

const certifications = [
  { name: "WBE", label: "Women's Business Enterprise" },
  { name: "NMSDC", label: "NMSDC MBE Certified" },
  { name: "10KSB", label: "Goldman Sachs 10KSB" },
];

export function SocialProof() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="border-y border-[var(--border)] bg-[var(--bg-elevated)] py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12">
          <SectionHeading
            eyebrow="Trusted & Certified"
            title="What Our Clients Say"
            align="center"
          />
        </Reveal>

        <div className="mb-12 flex flex-wrap items-center justify-center gap-8">
          {certifications.map((cert, i) => (
            <Reveal key={cert.name} delay={i * 0.1}>
              <motion.div
                whileHover={{ scale: 1.05, y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="group flex h-20 w-32 cursor-default items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] transition-colors hover:border-[var(--border-yellow)] hover:shadow-lg hover:shadow-[var(--yellow)]/10"
                title={cert.label}
              >
                <span className="font-[family-name:var(--font-display)] text-lg font-bold uppercase text-[var(--muted)] transition-colors group-hover:text-[var(--yellow)]">
                  {cert.name}
                </span>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <div className="relative mx-auto max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={current}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <p className="text-lg leading-relaxed text-[var(--cream)] md:text-xl">
                &ldquo;{testimonials[current].quote}&rdquo;
              </p>
              {testimonials[current].author && (
                <footer className="mt-4 text-sm text-[var(--orange)]">
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
                    className={`block h-2.5 w-2.5 rounded-full transition-colors ${
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
