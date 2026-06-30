import { LedBarSign } from "@/components/sections/LedBarSign";
import { Button } from "@/components/ui/Button";
import { Reveal, StaggerReveal, StaggerItem } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { aboutContent } from "@/lib/about-content";

export function AboutKOT() {
  return (
    <section id="about" className="scroll-mt-20 border-b border-[var(--border)] py-14 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal direction="left">
            <LedBarSign className="w-full" />
          </Reveal>

          <div>
            <Reveal>
              <SectionHeading
                eyebrow={aboutContent.eyebrow}
                title={aboutContent.title}
                className="mb-6"
              />
            </Reveal>

            <div className="space-y-4">
              <Reveal>
                <p className="leading-relaxed text-[var(--muted)]">
                  {aboutContent.hero.description}
                </p>
              </Reveal>
              {aboutContent.kotParagraphs.slice(0, 1).map((p, i) => (
                <Reveal key={i} delay={0.08}>
                  <p className="leading-relaxed text-[var(--muted)]">{p}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2} className="mt-8">
              <Button href="/about" variant="secondary">
                Read Our Full Story
              </Button>
            </Reveal>
          </div>
        </div>

        <StaggerReveal className="mt-16 grid gap-6 md:grid-cols-3">
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
  );
}
