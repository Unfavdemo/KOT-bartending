"use client";

import { useEffect, useId, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  variant?: "danger" | "default";
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId();
  const descId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !loading) onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, loading, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-label="Close dialog"
            onClick={loading ? undefined : onCancel}
          />
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="card-kot relative z-10 w-full max-w-md rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex gap-4">
              <div
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                  variant === "danger"
                    ? "bg-red-500/15 text-red-400"
                    : "bg-[var(--orange)]/15 text-[var(--orange)]",
                )}
              >
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h2
                  id={titleId}
                  className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--cream)]"
                >
                  {title}
                </h2>
                <p id={descId} className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  {description}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                ref={cancelRef}
                type="button"
                disabled={loading}
                onClick={onCancel}
                className="inline-flex w-full items-center justify-center rounded-lg border border-[var(--border)] px-6 py-2.5 text-sm font-medium text-[var(--cream)] transition-colors hover:border-[var(--orange)] hover:text-[var(--orange)] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={onConfirm}
                className={cn(
                  "inline-flex w-full items-center justify-center rounded-lg border px-6 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto",
                  variant === "danger"
                    ? "border-red-400/40 bg-red-500/15 text-red-300 hover:bg-red-500/25"
                    : "border-[var(--orange)] bg-[var(--orange)] text-black hover:bg-[var(--yellow)]",
                )}
              >
                {loading ? "Working…" : confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
