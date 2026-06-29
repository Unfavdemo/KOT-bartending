import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading title="Privacy Policy" className="mb-8" />
        <div className="prose prose-invert space-y-4 text-sm text-[var(--muted)]">
          <p>
            Kitty on Top Bartending (&quot;KOT&quot;) respects your privacy. We collect
            information you provide through booking inquiries, shop purchases, and
            community submissions solely to fulfill our services and communicate with
            you.
          </p>
          <p>
            We do not sell your personal information. Payment processing is handled
            securely by Stripe. For questions, contact hello@kittyontopbartending.com.
          </p>
        </div>
      </div>
    </div>
  );
}
