import { Hero } from "@/components/sections/Hero";
import { AboutKOT } from "@/components/sections/AboutKOT";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { StatsBar } from "@/components/sections/StatsBar";
import { FlavorPairing } from "@/components/sections/FlavorPairing";
import { SocialProof } from "@/components/sections/SocialProof";
import { CommunityPreview } from "@/components/sections/CommunityPreview";
import { CtaSection } from "@/components/sections/CtaSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutKOT />
      <ServicesGrid />
      <StatsBar />
      <FlavorPairing />
      <SocialProof />
      <CommunityPreview />
      <CtaSection />
    </>
  );
}
