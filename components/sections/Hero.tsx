"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { HeroVideo } from "@/components/sections/HeroVideo";
import { siteConfig, bookHref } from "@/lib/site-config";

export function Hero() {
  return (
    <section className="relative flex min-h-[88vh] items-end overflow-hidden sm:items-center">
      <HeroVideo />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-20 pt-32 sm:px-6 sm:pb-24 lg:px-8">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--yellow)]"
          >
            {siteConfig.name}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold uppercase leading-[1.05] tracking-tight text-[var(--cream)] sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {siteConfig.tagline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-[var(--cream)]/80 sm:text-lg"
          >
            Elite mobile bartending for hosts who want more than drinks — curated
            cocktails, intentional hospitality, and a bar your guests remember.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Button href="#about" size="lg">
              Meet KOT
            </Button>
            <Button href="/services" variant="secondary" size="lg">
              Our Services
            </Button>
            <Button href={bookHref} variant="outline" size="lg">
              Book an Event
            </Button>
          </motion.div>
        </div>
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-[var(--muted)] transition-colors hover:text-[var(--orange)]"
        aria-label="Scroll to learn about KOT"
      >
        <span className="text-[10px] font-bold uppercase tracking-widest">Discover</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </motion.a>
    </section>
  );
}
