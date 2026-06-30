import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "border border-[var(--orange)] bg-[var(--orange)] text-black hover:bg-[var(--yellow)] hover:border-[var(--yellow)]",
  secondary:
    "border border-[var(--yellow)] bg-transparent text-[var(--yellow)] hover:bg-[var(--yellow)] hover:text-black",
  outline:
    "border border-[var(--border)] bg-transparent text-[var(--cream)] hover:border-[var(--orange)] hover:text-[var(--orange)]",
  ghost:
    "border border-transparent bg-transparent text-[var(--cream)] hover:text-[var(--orange)]",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3.5 text-base",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  href,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
