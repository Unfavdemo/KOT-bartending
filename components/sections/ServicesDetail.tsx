"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { bookHref } from "@/lib/site-config";
import type { Service } from "@/lib/services";

interface ServicesDetailProps {
  services: Service[];
}

export function ServicesDetail({ services }: ServicesDetailProps) {
  return (
    <div className="space-y-24">
      {services.map((service, i) => (
        <Reveal
          key={service.id}
          direction={i % 2 === 0 ? "left" : "right"}
          delay={0.1}
        >
          <article
            id={service.anchor}
            className={`scroll-mt-24 flex flex-col gap-8 lg:items-center ${
              i % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
            }`}
          >
            <div className="group relative aspect-[4/3] flex-1 overflow-hidden rounded-xl border border-[var(--border)] transition-colors hover:border-[var(--border-orange)]">
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex-1 space-y-4">
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold uppercase text-[var(--cream)]">
                {service.title}
              </h2>
              <p className="leading-relaxed text-[var(--muted)]">
                {service.fullDescription}
              </p>
              <Button href={bookHref}>{service.cta}</Button>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
