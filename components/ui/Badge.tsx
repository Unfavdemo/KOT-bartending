import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "orange" | "yellow" | "neutral";
  className?: string;
}

export function Badge({
  children,
  variant = "orange",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wider",
        variant === "orange" &&
          "border border-[var(--border-orange)] bg-[var(--orange)]/10 text-[var(--orange)]",
        variant === "yellow" &&
          "border border-[var(--border-yellow)] bg-[var(--yellow)]/10 text-[var(--yellow)]",
        variant === "neutral" &&
          "border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]",
        className,
      )}
    >
      {children}
    </span>
  );
}
