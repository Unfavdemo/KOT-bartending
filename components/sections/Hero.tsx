"use client";

import { Button } from "@/components/ui/Button";
import { HeroVideo } from "@/components/sections/HeroVideo";
import { siteConfig, bookHref } from "@/lib/site-config";

export function Hero() {
  return (
    <section className="relative flex min-h-[75vh] items-center overflow-hidden sm:min-h-[82vh]">
      <HeroVideo />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium tracking-wide text-[var(--yellow)]">
            {siteConfig.name}
          </p>

          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.12] text-[var(--cream)] sm:text-5xl md:text-6xl">
            {siteConfig.tagline}
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--cream)]/75 sm:text-lg">
            Curated mobile bartending for private celebrations and corporate events
            across Greater Philadelphia, NJ, and DE.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button href={bookHref} size="lg" className="w-full sm:w-auto">
              Schedule a consultation
            </Button>
            <Button href="/services" variant="outline" size="lg" className="w-full sm:w-auto">
              View services
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
