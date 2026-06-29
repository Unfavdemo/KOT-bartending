import { ServicesDetail } from "@/components/sections/ServicesDetail";
import { ServicesBookSection } from "@/components/sections/ServicesBookSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { services } from "@/lib/services";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services & Booking",
  description:
    "Private parties, corporate events, cocktail classes, and event booking with Kitty on Top Bartending.",
};

export default function ServicesPage() {
  return (
    <>
      <div className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-16">
            <SectionHeading
              eyebrow="Our Services"
              title="Crafted for Every Occasion"
              description="Explore what we offer, then book a planning call or submit your event brief — all on this page."
            />
          </Reveal>

          <ServicesDetail services={services} />

          <Reveal className="mx-auto mt-20 max-w-xl text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--yellow)]">
              Ready to move forward?
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
              When you&apos;ve found the right fit, scroll down to schedule a call or
              submit your event brief.
            </p>
            <a
              href="#book"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[var(--orange)] transition-colors hover:text-[var(--yellow)]"
            >
              Book your event ↓
            </a>
          </Reveal>
        </div>
      </div>

      <ServicesBookSection />
    </>
  );
}
