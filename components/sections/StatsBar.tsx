"use client";

import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";

const stats = [
  { value: 500, suffix: "+", label: "Events Served" },
  { value: 50, suffix: "+", label: "Corporate Clients" },
  { value: 4, suffix: "", label: "House Syrups" },
  { value: 100, suffix: "%", label: "Client Satisfaction" },
];

export function StatsBar() {
  return (
    <section className="relative overflow-hidden border-y border-[var(--border)] py-14">
      <div className="absolute inset-0 bg-[var(--surface)] opacity-50" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.1} className="text-center">
              <p className="font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--orange)] sm:text-4xl md:text-5xl">
                <CountUp end={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-[11px] font-semibold uppercase leading-tight tracking-wide text-[var(--muted)] sm:text-xs sm:tracking-wider">
                {stat.label}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
