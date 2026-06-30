import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { aboutContent } from "@/lib/about-content";

export function AboutKOT() {
  return (
    <section id="about" className="scroll-mt-20 border-b border-[var(--border)] py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={aboutContent.eyebrow}
          title={aboutContent.title}
          align="center"
          className="mb-8"
        />

        <div className="space-y-5 text-center text-base leading-relaxed text-[var(--muted)]">
          <p>{aboutContent.hero.description}</p>
          <p>{aboutContent.kotParagraphs[0]}</p>
        </div>

        <div className="mt-10 flex justify-center">
          <Button href="/about" variant="outline">
            Read our full story
          </Button>
        </div>
      </div>
    </section>
  );
}
