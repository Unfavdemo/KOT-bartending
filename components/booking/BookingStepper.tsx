"use client";

import { cn } from "@/lib/utils";

export type BookingStep = {
  id: string;
  label: string;
  shortLabel?: string;
};

type BookingStepperProps = {
  steps: BookingStep[];
  currentStep: number;
  className?: string;
  onStepClick?: (index: number) => void;
};

export function BookingStepper({
  steps,
  currentStep,
  className,
  onStepClick,
}: BookingStepperProps) {
  return (
    <nav aria-label="Progress" className={cn("w-full", className)}>
      <ol className="flex items-center gap-2 sm:gap-0">
        {steps.map((step, index) => {
          const isComplete = index < currentStep;
          const isCurrent = index === currentStep;
          const clickable = onStepClick && index < currentStep;

          return (
            <li
              key={step.id}
              className={cn(
                "flex flex-1 items-center",
                index < steps.length - 1 && "sm:pr-4",
              )}
            >
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onStepClick(index)}
                className={cn(
                  "group flex w-full flex-col items-center gap-2 sm:flex-row sm:items-center sm:gap-3",
                  clickable && "cursor-pointer",
                  !clickable && "cursor-default",
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                    isComplete && "bg-[var(--orange)] text-black",
                    isCurrent && "border-2 border-[var(--orange)] bg-[var(--orange)]/15 text-[var(--orange)]",
                    !isComplete && !isCurrent && "border border-[var(--border)] text-[var(--muted)]",
                  )}
                >
                  {isComplete ? "✓" : index + 1}
                </span>
                <span className="min-w-0 text-center sm:text-left">
                  <span
                    className={cn(
                      "block text-[10px] font-bold uppercase tracking-wider sm:text-xs",
                      isCurrent ? "text-[var(--cream)]" : "text-[var(--muted)]",
                    )}
                  >
                    <span className="sm:hidden">{step.shortLabel ?? step.label}</span>
                    <span className="hidden sm:inline">{step.label}</span>
                  </span>
                </span>
              </button>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-2 hidden h-px flex-1 sm:block",
                    index < currentStep ? "bg-[var(--orange)]" : "bg-[var(--border)]",
                  )}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
