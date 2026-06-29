"use client";

import { useEffect, useState } from "react";
import { EventConfigurator } from "@/components/sections/EventConfigurator";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { BookingStepper } from "@/components/booking/BookingStepper";
import {
  loadBookingPrefill,
  saveBookingPrefill,
  type BookingPrefill,
} from "@/lib/booking-prefill";
import type { EventType } from "@/lib/event-estimator";

const inquirySteps = [
  { id: "configure", label: "Configure event", shortLabel: "Configure" },
  { id: "preferences", label: "Menu & spirits", shortLabel: "Menu" },
  { id: "contact", label: "Contact & submit", shortLabel: "Contact" },
];

export function QuoteInquiryFlow() {
  const [flowStep, setFlowStep] = useState(0);
  const [eventConfig, setEventConfig] = useState<BookingPrefill | null>(null);

  useEffect(() => {
    const prefill = loadBookingPrefill();
    if (prefill) {
      setEventConfig(prefill);
      setFlowStep(1);
    }
  }, []);

  function handleConfigureContinue(data: BookingPrefill) {
    saveBookingPrefill(data);
    setEventConfig(data);
    setFlowStep(1);
  }

  function handleBackToConfigure() {
    setFlowStep(0);
  }

  return (
    <div className="space-y-6">
      <BookingStepper
        steps={inquirySteps}
        currentStep={flowStep}
        onStepClick={(index) => {
          if (index === 0) setFlowStep(0);
        }}
      />

      {flowStep === 0 && (
        <EventConfigurator embedded compact onContinue={handleConfigureContinue} />
      )}

      {flowStep >= 1 && eventConfig && (
        <div>
          <button
            type="button"
            onClick={handleBackToConfigure}
            className="mb-4 text-xs font-semibold text-[var(--muted)] hover:text-[var(--orange)]"
          >
            ← Edit event details
          </button>
          <BookingWizard
            embedded
            externalEventDetails={{
              eventType: eventConfig.eventType as EventType,
              guestCount: eventConfig.guestCount,
              eventDate: eventConfig.eventDate ?? "",
            }}
            wizardStep={flowStep - 1}
            onWizardStepChange={(step) => setFlowStep(step + 1)}
            onBackToConfigure={handleBackToConfigure}
          />
        </div>
      )}
    </div>
  );
}
