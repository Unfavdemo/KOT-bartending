import { Hero } from "@/components/sections/Hero";
import { AboutKOT } from "@/components/sections/AboutKOT";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { SocialProof } from "@/components/sections/SocialProof";
import { CtaSection } from "@/components/sections/CtaSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutKOT />
      <ServicesGrid />
      <SocialProof />
      <CtaSection />
    </>
  );
}
