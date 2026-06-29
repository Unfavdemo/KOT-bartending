import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading title="Terms of Service" className="mb-8" />
        <div className="space-y-4 text-sm text-[var(--muted)]">
          <p>
            By using the Kitty on Top Bartending website and services, you agree to
            these terms. Event bookings are subject to availability and confirmation.
            Shop purchases are final unless otherwise stated.
          </p>
          <p>
            KOT reserves the right to refuse service for events that do not align
            with our values or licensing requirements. For questions, contact
            hello@kittyontopbartending.com.
          </p>
        </div>
      </div>
    </div>
  );
}
