"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Clock, Users, Wine } from "lucide-react";
import {
  estimateEvent,
  EVENT_TYPE_LABELS,
  type EventType,
} from "@/lib/event-estimator";

interface EventSummaryProps {
  eventType: EventType;
  guestCount: number;
  eventDate?: string;
  spiritPreferences?: string[];
  step: number;
}

export function EventSummary({
  eventType,
  guestCount,
  eventDate,
  spiritPreferences,
  step,
}: EventSummaryProps) {
  const estimate = estimateEvent(guestCount, eventType);

  return (
    <div className="card-kot rounded-xl border-[var(--border-orange)] p-6">
      <p className="text-xs font-bold uppercase tracking-wider text-[var(--orange)]">
        Your Event
      </p>
      <h3 className="mt-1 font-[family-name:var(--font-display)] text-lg font-bold uppercase text-[var(--cream)]">
        {EVENT_TYPE_LABELS[eventType]}
      </h3>

      <div className="mt-5 space-y-3 text-sm">
        <div className="flex items-center gap-2 text-[var(--muted)]">
          <Users className="h-4 w-4 text-[var(--yellow)]" />
          <span>{guestCount} guests</span>
        </div>
        <div className="flex items-center gap-2 text-[var(--muted)]">
          <Wine className="h-4 w-4 text-[var(--yellow)]" />
          <span>{estimate.bartenders} bartender{estimate.bartenders > 1 ? "s" : ""}</span>
        </div>
        <div className="flex items-center gap-2 text-[var(--muted)]">
          <Clock className="h-4 w-4 text-[var(--yellow)]" />
          <span>~{estimate.serviceHours} hr service</span>
        </div>
        {eventDate && (
          <p className="text-[var(--muted)]">
            📅 {new Date(eventDate + "T12:00:00").toLocaleDateString()}
          </p>
        )}
        {spiritPreferences && spiritPreferences.length > 0 && step >= 1 && (
          <p className="text-xs text-[var(--muted)]">
            Spirits: {spiritPreferences.join(", ")}
          </p>
        )}
      </div>

      <div className="mt-4 flex gap-1">
        {[0, 1, 2].map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-colors ${
              s <= step ? "bg-[var(--orange)]" : "bg-[var(--border)]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

interface StepTransitionProps {
  step: number;
  children: React.ReactNode;
}

export function StepTransition({ step, children }: StepTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -24 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
