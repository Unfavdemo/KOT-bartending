"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, StaggerReveal, StaggerItem } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { services } from "@/lib/services";

export function ServicesGrid() {
  return (
    <section id="services" className="py-20 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12">
          <SectionHeading
            eyebrow="What We Do"
            title="Experiences Worth Remembering"
            description="From corporate galas to intimate celebrations, every pour is intentional."
          />
        </Reveal>

        <StaggerReveal className="grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <StaggerItem key={service.id}>
              <Link href={`/services#${service.anchor}`}>
                <TiltCard>
                  <Card className="group h-full overflow-hidden p-0">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute inset-0 bg-[var(--orange)]/0 transition-colors duration-300 group-hover:bg-[var(--orange)]/10" />
                    </div>
                    <div className="p-6">
                      <h3 className="font-[family-name:var(--font-display)] text-xl font-bold uppercase text-[var(--cream)] transition-colors group-hover:text-[var(--orange)]">
                        {service.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                        {service.shortDescription}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--orange)] transition-all group-hover:gap-2 group-hover:text-[var(--yellow)]">
                        {service.cta}
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Card>
                </TiltCard>
              </Link>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
