import { LedBarSign } from "@/components/sections/LedBarSign";
import { AboutFaqSection } from "@/components/sections/AboutFaqSection";
import { Reveal, StaggerReveal, StaggerItem } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { aboutContent } from "@/lib/about-content";
import { bookHref, siteConfig } from "@/lib/site-config";
import { MapPin } from "lucide-react";

export function AboutPageContent() {
  return (
    <>
      <section className="border-b border-[var(--border)] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--orange)]">
              About Us
            </p>
            <h1 className="mt-6 space-y-1 font-[family-name:var(--font-display)] text-3xl font-bold uppercase leading-tight text-[var(--cream)] md:text-4xl lg:text-5xl">
              {aboutContent.hero.taglines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-8 text-lg leading-relaxed text-[var(--muted)]">
              {aboutContent.hero.description}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-[var(--border)] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-14 lg:grid-cols-2 lg:gap-20">
            <Reveal direction="left">
              <LedBarSign className="w-full" />
            </Reveal>

            <div>
              <Reveal>
                <SectionHeading
                  title={aboutContent.firm.title}
                  className="mb-8"
                />
              </Reveal>

              <div className="space-y-5">
                {aboutContent.firm.paragraphs.map((p, i) => (
                  <Reveal key={i} delay={i * 0.06}>
                    <p className="leading-relaxed text-[var(--muted)]">{p}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border)] bg-[var(--bg-elevated)] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <Reveal>
                <SectionHeading
                  eyebrow={aboutContent.eyebrow}
                  title={aboutContent.title}
                  className="mb-8"
                />
              </Reveal>
              <div className="space-y-5">
                {aboutContent.kotParagraphs.map((p, i) => (
                  <Reveal key={i} delay={i * 0.06}>
                    <p className="leading-relaxed text-[var(--muted)]">{p}</p>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal direction="right" delay={0.1}>
              <div className="card-kot rounded-xl p-8">
                <h2 className="font-[family-name:var(--font-display)] text-xl font-bold uppercase text-[var(--cream)]">
                  {aboutContent.philosophy.title}
                </h2>
                <p className="mt-4 leading-relaxed text-[var(--muted)]">
                  {aboutContent.philosophy.body}
                </p>

                <div className="mt-8 space-y-4 border-t border-[var(--border)] pt-8">
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--yellow)]">
                    Leadership
                  </p>
                  {aboutContent.leadership.map((person) => (
                    <div key={person.name}>
                      <p className="text-sm font-semibold text-[var(--cream)]">{person.name}</p>
                      <p className="text-xs text-[var(--muted)]">{person.role}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex gap-3 border-t border-[var(--border)] pt-6">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--orange)]" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--yellow)]">
                      {aboutContent.classroom.label}
                    </p>
                    <p className="mt-1 text-sm text-[var(--cream)]">
                      {aboutContent.classroom.street}
                      <br />
                      {aboutContent.classroom.city}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border)] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <StaggerReveal className="grid gap-6 md:grid-cols-3">
            {aboutContent.pillars.map((pillar) => (
              <StaggerItem key={pillar.title}>
                <div className="card-kot h-full rounded-xl p-6">
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold uppercase text-[var(--orange)]">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                    {pillar.body}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      <AboutFaqSection />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-10 text-center">
            <SectionHeading
              eyebrow="Certified & Trusted"
              title="Built on Excellence"
              align="center"
            />
          </Reveal>

          <StaggerReveal className="flex flex-wrap items-center justify-center gap-8">
            {aboutContent.certifications.map((cert) => (
              <StaggerItem key={cert.name}>
                <div
                  className="flex h-24 w-36 flex-col items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)]"
                  title={cert.label}
                >
                  <span className="font-[family-name:var(--font-display)] text-xl font-bold uppercase text-[var(--yellow)]">
                    {cert.name}
                  </span>
                  <span className="mt-1 px-2 text-center text-[10px] uppercase tracking-wide text-[var(--muted)]">
                    {cert.label}
                  </span>
                </div>
              </StaggerItem>
            ))}
          </StaggerReveal>

          <Reveal className="mt-14 flex flex-col items-center gap-6">
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="/services" size="lg">
                Our Services
              </Button>
              <Button href={bookHref} variant="secondary" size="lg">
                Schedule a Consultation
              </Button>
            </div>
            <p className="text-center text-xs text-[var(--muted)]">
              {siteConfig.email} · {aboutContent.credits}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
