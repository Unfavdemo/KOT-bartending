"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Users, Wine } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import {
  estimateEvent,
  EVENT_TYPE_LABELS,
  type EventType,
} from "@/lib/event-estimator";
import { saveBookingPrefill, type BookingPrefill } from "@/lib/booking-prefill";
import { cn } from "@/lib/utils";

const eventTypes: { id: EventType; label: string; desc: string }[] = [
  { id: "private", label: "Private Party", desc: "Weddings, birthdays, milestones" },
  { id: "corporate", label: "Corporate", desc: "Galas, activations, appreciation" },
  { id: "class", label: "Cocktail Class", desc: "In-person or virtual instruction" },
];

interface EventConfiguratorProps {
  embedded?: boolean;
  compact?: boolean;
  onContinue?: (data: BookingPrefill) => void;
}

export function EventConfigurator({
  embedded = false,
  compact = false,
  onContinue,
}: EventConfiguratorProps) {
  const router = useRouter();
  const [eventType, setEventType] = useState<EventType>("private");
  const [guestCount, setGuestCount] = useState(50);
  const [eventDate, setEventDate] = useState("");

  const estimate = useMemo(
    () => estimateEvent(guestCount, eventType),
    [guestCount, eventType],
  );

  function handleContinue() {
    const data: BookingPrefill = {
      eventType,
      guestCount,
      eventDate: eventDate || undefined,
    };
    saveBookingPrefill(data);
    if (onContinue) {
      onContinue(data);
      return;
    }
    router.push("/services?path=quote");
  }

  return (
    <section
      id={embedded ? undefined : "configurator"}
      className={embedded ? "" : "scroll-mt-20 border-b border-[var(--border)] py-20"}
    >
      <div className={embedded ? "" : "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"}>
        {!embedded && (
          <Reveal className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--orange)]">
              Event Configurator
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold uppercase text-[var(--cream)] md:text-4xl">
              Plan Your Bar Experience
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--muted)]">
              Configure your event and see a live estimate — then continue to book with everything pre-filled.
            </p>
          </Reveal>
        )}

        <div className={cn("grid gap-8", compact ? "grid-cols-1" : "lg:grid-cols-5")}>
          <Reveal delay={0.1} className={compact ? "" : "lg:col-span-3"}>
            <div className={cn("space-y-8", compact ? "" : "card-kot rounded-xl p-6 md:p-8")}>
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--yellow)]">
                  Event Type
                </p>
                <div className={cn("grid gap-3", compact ? "grid-cols-1" : "sm:grid-cols-3")}>
                  {eventTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setEventType(type.id)}
                      className={cn(
                        "rounded-xl border p-4 text-left transition-all duration-200",
                        eventType === type.id
                          ? "scale-[1.02] border-[var(--orange)] bg-[var(--orange)]/10"
                          : "border-[var(--border)] hover:border-[var(--border-orange)]",
                      )}
                    >
                      <p className="text-sm font-bold uppercase text-[var(--cream)]">{type.label}</p>
                      <p className="mt-1 text-xs text-[var(--muted)]">{type.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--yellow)]">
                    Guest Count
                  </p>
                  <span className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--orange)]">
                    {guestCount}
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={eventType === "class" ? 30 : 200}
                  step={5}
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="kot-range w-full"
                />
                <div className="mt-1 flex justify-between text-xs text-[var(--muted)]">
                  <span>10</span>
                  <span>{eventType === "class" ? "30" : "200"}</span>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--yellow)]">
                  Preferred Date (optional)
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="kot-input"
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2} className={compact ? "" : "lg:col-span-2"}>
            <motion.div
              layout
              className={cn(
                "rounded-xl border-[var(--border-orange)] p-6",
                compact ? "border border-[var(--border)] bg-[var(--surface)]" : "card-kot sticky top-24",
              )}
            >
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--orange)]">
                Live Estimate
              </p>
              <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl font-bold uppercase text-[var(--cream)]">
                {EVENT_TYPE_LABELS[eventType]}
              </h3>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-[var(--yellow)]" />
                  <div>
                    <p className="text-xs text-[var(--muted)]">Guests</p>
                    <p className="text-sm font-semibold text-[var(--cream)]">{estimate.guestRange}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Wine className="h-5 w-5 text-[var(--yellow)]" />
                  <div>
                    <p className="text-xs text-[var(--muted)]">Bartenders</p>
                    <p className="text-sm font-semibold text-[var(--cream)]">
                      {estimate.bartenders} recommended
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-[var(--yellow)]" />
                  <div>
                    <p className="text-xs text-[var(--muted)]">Service Window</p>
                    <p className="text-sm font-semibold text-[var(--cream)]">
                      ~{estimate.serviceHours} hours
                    </p>
                  </div>
                </div>
                {eventDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-[var(--yellow)]" />
                    <div>
                      <p className="text-xs text-[var(--muted)]">Date</p>
                      <p className="text-sm font-semibold text-[var(--cream)]">
                        {new Date(eventDate + "T12:00:00").toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <p className="mt-6 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-xs leading-relaxed text-[var(--muted)]">
                {estimate.barStyle}
              </p>

              <Button className="mt-6 w-full" onClick={handleContinue}>
                {onContinue ? "Continue" : "Continue to Booking"}
              </Button>
              <p className="mt-2 text-center text-[10px] text-[var(--muted)]">
                Estimates are guidelines — final quote confirmed after inquiry.
              </p>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}