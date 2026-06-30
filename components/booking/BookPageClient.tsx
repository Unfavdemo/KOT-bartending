"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ConsultationScheduler } from "@/components/booking/ConsultationScheduler";
import { QuoteInquiryFlow } from "@/components/booking/QuoteInquiryFlow";
import {
  BookingPathChooser,
  BookingPathHint,
  type BookingPath,
} from "@/components/booking/BookingPathChooser";
import { BookingStepper } from "@/components/booking/BookingStepper";

const callSteps = [
  { id: "time", label: "Choose a time", shortLabel: "Time" },
  { id: "details", label: "Your details", shortLabel: "Details" },
];

export function BookPageClient() {
  const searchParams = useSearchParams();
  const [path, setPath] = useState<BookingPath | null>(null);
  const [callStep, setCallStep] = useState(0);

  useEffect(() => {
    const param = searchParams.get("path");
    if (param === "quote" || param === "call") {
      setPath(param);
    }
  }, [searchParams]);

  return (
    <div className="space-y-8">
      {!path ? (
        <>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--yellow)]">
              Start here
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-xl font-bold uppercase text-[var(--cream)] md:text-2xl">
              How would you like to connect?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              Schedule a quick planning call or submit a full event brief — whichever
              fits your timeline.
            </p>
          </div>
          <BookingPathChooser value={path} onChange={setPath} />
          <BookingPathHint />
        </>
      ) : path === "call" ? (
        <div className="space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--orange)]">
              Planning call
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-xl font-bold uppercase text-[var(--cream)]">
              Book a 30-minute call
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Pick an open slot — availability updates live.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPath(null)}
            className="-ml-2 min-h-11 px-2 text-left text-sm font-semibold text-[var(--muted)] hover:text-[var(--orange)]"
          >
            ← Change path
          </button>
          <BookingStepper steps={callSteps} currentStep={callStep} />
          <ConsultationScheduler onStepChange={setCallStep} />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--orange)]">
                Event inquiry
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-xl font-bold uppercase text-[var(--cream)]">
                Request a custom quote
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setPath(null)}
              className="-ml-2 min-h-11 shrink-0 px-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--orange)]"
            >
              ← Change path
            </button>
          </div>
          <QuoteInquiryFlow />
        </div>
      )}
    </div>
  );
}
