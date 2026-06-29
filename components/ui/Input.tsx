import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id || props.name;

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-[var(--cream)]">
          {label}
        </label>
      )}
      <input id={inputId} className={cn("kot-input", className)} {...props} />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
