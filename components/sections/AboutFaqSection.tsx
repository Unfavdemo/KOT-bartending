import { aboutContent } from "@/lib/about-content";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function AboutFaqSection() {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--bg-elevated)] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently Asked Questions"
            description="Answers to common questions about our services, booking, and event day details."
            align="center"
          />
        </Reveal>

        <div className="mx-auto max-w-3xl space-y-12">
          {aboutContent.faqSections.map((section, sectionIndex) => (
            <Reveal key={section.title} delay={sectionIndex * 0.05}>
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold uppercase text-[var(--orange)]">
                  {section.title}
                </h3>
                <dl className="mt-6 space-y-6">
                  {section.items.map((item) => (
                    <div
                      key={item.q}
                      className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
                    >
                      <dt className="text-sm font-semibold text-[var(--cream)]">{item.q}</dt>
                      <dd className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                        {item.a}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
