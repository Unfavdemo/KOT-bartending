"use client";

import { Calendar, FileText, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export type BookingPath = "call" | "quote";

type BookingPathChooserProps = {
  value: BookingPath | null;
  onChange: (path: BookingPath) => void;
};

const paths = [
  {
    id: "call" as const,
    icon: Phone,
    title: "Schedule a Call",
    description:
      "Pick a live 30-minute slot to talk through your event with our team. Best if you want guidance before committing.",
    cta: "See open times",
    badge: "Fastest",
  },
  {
    id: "quote" as const,
    icon: FileText,
    title: "Request a Quote",
    description:
      "Configure your event, share menu preferences, and submit a full inquiry. We'll respond within 24–48 hours.",
    cta: "Start inquiry",
    badge: "Most detail",
  },
];

export function BookingPathChooser({ value, onChange }: BookingPathChooserProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {paths.map((path) => {
        const Icon = path.icon;
        const active = value === path.id;
        return (
          <button
            key={path.id}
            type="button"
            onClick={() => onChange(path.id)}
            className={cn(
              "group relative rounded-xl border p-6 text-left transition-all duration-200",
              active
                ? "border-[var(--orange)] bg-[var(--orange)]/10 shadow-[0_0_0_1px_var(--orange)]"
                : "card-kot border-[var(--border)] hover:border-[var(--border-orange)]",
            )}
          >
            <span className="absolute right-4 top-4 rounded-full border border-[var(--border-orange)] bg-[var(--surface)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--orange)]">
              {path.badge}
            </span>
            <div
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-lg transition-colors",
                active
                  ? "bg-[var(--orange)] text-black"
                  : "bg-[var(--surface)] text-[var(--yellow)] group-hover:bg-[var(--orange)]/20",
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-[family-name:var(--font-display)] text-lg font-bold uppercase text-[var(--cream)]">
              {path.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              {path.description}
            </p>
            <p
              className={cn(
                "mt-4 text-xs font-bold uppercase tracking-wider",
                active ? "text-[var(--orange)]" : "text-[var(--muted)] group-hover:text-[var(--cream)]",
              )}
            >
              {path.cta} →
            </p>
          </button>
        );
      })}
    </div>
  );
}

export function BookingPathHint() {
  return (
    <p className="flex items-center justify-center gap-2 text-center text-xs text-[var(--muted)]">
      <Calendar className="h-3.5 w-3.5 text-[var(--yellow)]" />
      Not sure which to pick? Start with a call — you can always submit a full inquiry after.
    </p>
  );
}
