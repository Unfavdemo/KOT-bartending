import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  accent?: "orange" | "yellow" | "none";
}

export function Card({
  children,
  className,
  hover = true,
  accent = "none",
}: CardProps) {
  return (
    <div
      className={cn(
        "card-kot rounded-xl p-6",
        hover && "card-kot-hover",
        accent === "orange" && "border-[var(--border-orange)]",
        accent === "yellow" && "border-[var(--border-yellow)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
