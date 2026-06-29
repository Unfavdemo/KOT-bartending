"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { EventSummary, StepTransition } from "@/components/booking/EventSummary";
import {
  loadBookingPrefill,
  clearBookingPrefill,
  type BookingPrefill,
} from "@/lib/booking-prefill";
import { estimateEvent, type EventType } from "@/lib/event-estimator";
import { cn } from "@/lib/utils";

const eventDetailsSchema = z.object({
  eventDate: z.string().min(1, "Event date is required"),
  guestCount: z.number().min(1, "At least 1 guest"),
  eventType: z.enum(["private", "corporate", "class"]),
});

const preferencesSchema = z.object({
  spiritPreferences: z.array(z.string()).min(1, "Select at least one spirit"),
  spiritFree: z.boolean(),
  menuNotes: z.string().optional(),
});

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  venue: z.string().min(2, "Venue/location is required"),
  message: z.string().optional(),
});

type EventDetails = z.infer<typeof eventDetailsSchema>;
type Preferences = z.infer<typeof preferencesSchema>;
type Contact = z.infer<typeof contactSchema>;

const spiritOptions = ["Vodka", "Gin", "Rum", "Tequila", "Whiskey", "Bourbon", "Wine/Champagne"];
const steps = ["Event Details", "Preferences", "Contact"];

type BookingWizardProps = {
  embedded?: boolean;
  externalEventDetails?: EventDetails;
  wizardStep?: number;
  onWizardStepChange?: (step: number) => void;
  onBackToConfigure?: () => void;
};

export function BookingWizard({
  embedded = false,
  externalEventDetails,
  wizardStep: controlledWizardStep,
  onWizardStepChange,
  onBackToConfigure,
}: BookingWizardProps = {}) {
  const isContinuation = Boolean(externalEventDetails);
  const [internalStep, setInternalStep] = useState(0);
  const step = controlledWizardStep ?? internalStep;

  function setStep(next: number) {
    if (onWizardStepChange) onWizardStepChange(next);
    else setInternalStep(next);
  }
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [prefilled, setPrefilled] = useState(false);

  const [eventDetails, setEventDetails] = useState<EventDetails | null>(
    externalEventDetails ?? null,
  );
  const [preferences, setPreferences] = useState<Preferences | null>(null);

  const eventForm = useForm<EventDetails>({
    resolver: zodResolver(eventDetailsSchema),
    defaultValues: { eventType: "private", guestCount: 50, eventDate: "" },
  });

  const prefsForm = useForm<Preferences>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: { spiritPreferences: [], spiritFree: false, menuNotes: "" },
  });

  const contactForm = useForm<Contact>({
    resolver: zodResolver(contactSchema),
  });

  const watchedType = eventForm.watch("eventType") as EventType;
  const watchedGuests = eventForm.watch("guestCount") || 50;
  const watchedDate = eventForm.watch("eventDate");
  const watchedSpirits = prefsForm.watch("spiritPreferences");

  useEffect(() => {
    if (externalEventDetails) {
      setEventDetails(externalEventDetails);
      return;
    }
    const prefill: BookingPrefill | null = loadBookingPrefill();
    if (prefill) {
      eventForm.reset({
        eventType: prefill.eventType,
        guestCount: prefill.guestCount,
        eventDate: prefill.eventDate || "",
      });
      if (prefill.spiritPreferences?.length) {
        prefsForm.setValue("spiritPreferences", prefill.spiritPreferences);
      }
      if (prefill.menuNotes) {
        prefsForm.setValue("menuNotes", prefill.menuNotes);
      }
      setPrefilled(true);
    }
  }, [eventForm, prefsForm, externalEventDetails]);

  async function onEventSubmit(data: EventDetails) {
    setEventDetails(data);
    setStep(1);
  }

  async function onPrefsSubmit(data: Preferences) {
    setPreferences(data);
    setStep(isContinuation ? 1 : 2);
  }

  async function onContactSubmit(data: Contact) {
    setSubmitting(true);
    setError("");
    const estimate = eventDetails
      ? estimateEvent(eventDetails.guestCount, eventDetails.eventType)
      : null;

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...eventDetails,
          ...preferences,
          ...data,
          estimate,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Submission failed");
      }
      clearBookingPrefill();
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className={embedded ? "py-6 text-center" : "card-kot rounded-xl p-10 text-center"}>
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--orange)]">
          Inquiry Received
        </p>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold uppercase text-[var(--cream)]">
          We&apos;ll Be in Touch
        </h2>
        <p className="mt-4 text-[var(--muted)]">
          Thank you! Our team will review your event details and respond within 24–48 hours.
        </p>
      </div>
    );
  }

  const summaryStep = isContinuation ? step + 1 : step;

  return (
    <div className={embedded ? "space-y-6" : "grid gap-8 lg:grid-cols-3"}>
      {embedded && (
        <EventSummary
          eventType={eventDetails?.eventType ?? watchedType}
          guestCount={eventDetails?.guestCount ?? watchedGuests}
          eventDate={eventDetails?.eventDate ?? watchedDate}
          spiritPreferences={preferences?.spiritPreferences ?? watchedSpirits}
          step={summaryStep}
        />
      )}

      <div className={embedded ? "" : "lg:col-span-2"}>
        <div className={embedded ? "" : "card-kot rounded-xl p-6 md:p-10"}>
          {prefilled && !isContinuation && (
            <p className="mb-4 rounded-lg border border-[var(--border-yellow)] bg-[var(--yellow)]/10 px-3 py-2 text-xs text-[var(--yellow)]">
              ✓ Pre-filled from your event configuration
            </p>
          )}

          {!isContinuation && (
            <div className="mb-8 flex items-center justify-center gap-2">
              {steps.map((label, i) => (
                <div key={label} className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors",
                      i <= step ? "bg-[var(--orange)] text-black" : "border border-[var(--border)] text-[var(--muted)]",
                    )}
                  >
                    {i + 1}
                  </div>
                  <span className={cn("hidden text-xs font-semibold uppercase sm:inline", i <= step ? "text-[var(--cream)]" : "text-[var(--muted)]")}>
                    {label}
                  </span>
                  {i < steps.length - 1 && <div className="mx-2 hidden h-px w-8 bg-[var(--border)] sm:block" />}
                </div>
              ))}
            </div>
          )}

          <StepTransition step={step}>
            {!isContinuation && step === 0 && (
              <form onSubmit={eventForm.handleSubmit(onEventSubmit)} className="space-y-5">
                <Input label="Event Date" type="date" {...eventForm.register("eventDate")} error={eventForm.formState.errors.eventDate?.message} />
                <div>
                  <div className="mb-2 flex justify-between">
                    <label className="text-sm font-medium text-[var(--cream)]">Guest Count</label>
                    <span className="font-bold text-[var(--orange)]">{watchedGuests}</span>
                  </div>
                  <input type="range" min={10} max={200} step={5} className="kot-range w-full" {...eventForm.register("guestCount", { valueAsNumber: true })} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-[var(--cream)]">Event Type</label>
                  <select className="kot-input" {...eventForm.register("eventType")}>
                    <option value="private">Private Party</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="class">Cocktail Class</option>
                  </select>
                </div>
                <Button type="submit" className="w-full">Continue</Button>
              </form>
            )}

            {(isContinuation ? step === 0 : step === 1) && (
              <form onSubmit={prefsForm.handleSubmit(onPrefsSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--cream)]">Spirit Preferences</label>
                  <div className="flex flex-wrap gap-2">
                    {spiritOptions.map((spirit) => {
                      const selected = watchedSpirits?.includes(spirit);
                      return (
                        <button
                          key={spirit}
                          type="button"
                          onClick={() => {
                            const current = prefsForm.getValues("spiritPreferences") || [];
                            prefsForm.setValue("spiritPreferences", selected ? current.filter((s) => s !== spirit) : [...current, spirit]);
                          }}
                          className={cn(
                            "rounded-lg border px-3 py-1.5 text-sm transition-all",
                            selected ? "scale-105 border-[var(--orange)] bg-[var(--orange)]/10 text-[var(--orange)]" : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--border-orange)]",
                          )}
                        >
                          {spirit}
                        </button>
                      );
                    })}
                  </div>
                  {prefsForm.formState.errors.spiritPreferences && (
                    <p className="text-xs text-red-400">{prefsForm.formState.errors.spiritPreferences.message}</p>
                  )}
                </div>
                <label className="flex items-center gap-2 text-sm text-[var(--cream)]">
                  <input type="checkbox" {...prefsForm.register("spiritFree")} />
                  Include spirit-free options
                </label>
                <Textarea label="Menu Notes (optional)" placeholder="Allergies, theme, favorite cocktails..." {...prefsForm.register("menuNotes")} />
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (isContinuation) onBackToConfigure?.();
                      else setStep(0);
                    }}
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1">Continue</Button>
                </div>
              </form>
            )}

            {(isContinuation ? step === 1 : step === 2) && (
              <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-5">
                <Input label="Your Name" {...contactForm.register("name")} error={contactForm.formState.errors.name?.message} />
                <Input label="Email" type="email" {...contactForm.register("email")} error={contactForm.formState.errors.email?.message} />
                <Input label="Phone (optional)" type="tel" {...contactForm.register("phone")} />
                <Input label="Venue / Location" {...contactForm.register("venue")} error={contactForm.formState.errors.venue?.message} />
                <Textarea label="Additional Message (optional)" {...contactForm.register("message")} />
                {error && <p className="text-sm text-red-400">{error}</p>}
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setStep(isContinuation ? 0 : 1)}>
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit Inquiry"}
                  </Button>
                </div>
              </form>
            )}
          </StepTransition>
        </div>
      </div>

      {!embedded && (
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <EventSummary
              eventType={eventDetails?.eventType ?? watchedType}
              guestCount={eventDetails?.guestCount ?? watchedGuests}
              eventDate={eventDetails?.eventDate ?? watchedDate}
              spiritPreferences={preferences?.spiritPreferences ?? watchedSpirits}
              step={summaryStep}
            />
          </div>
        </div>
      )}
    </div>
  );
}
