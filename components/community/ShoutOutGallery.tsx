"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface ShoutOut {
  id: string;
  clientName: string;
  eventType: string;
  quote: string;
  imageUrl?: string | null;
}

interface ShoutOutGalleryProps {
  shoutOuts: ShoutOut[];
}

const PLACEHOLDER_GRADIENTS = [
  "from-[var(--orange)]/30 to-[var(--yellow)]/20",
  "from-purple-900/40 to-[var(--orange)]/20",
  "from-[var(--yellow)]/20 to-rose-900/30",
];

export function ShoutOutGallery({ shoutOuts }: ShoutOutGalleryProps) {
  const [lightbox, setLightbox] = useState<ShoutOut | null>(null);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {shoutOuts.map((shout, i) => (
          <Card
            key={shout.id}
            accent="orange"
            className="group cursor-pointer"
            hover
          >
            <button
              type="button"
              className="w-full text-left"
              onClick={() => setLightbox(shout)}
            >
              <div
                className={`relative mb-4 flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br ${PLACEHOLDER_GRADIENTS[i % PLACEHOLDER_GRADIENTS.length]}`}
              >
                {shout.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={shout.imageUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-4xl">🥂</span>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                  <ZoomIn className="h-6 w-6 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--orange)]">
                {shout.eventType}
              </p>
              <blockquote className="mt-2 text-sm italic leading-relaxed text-[var(--cream)] line-clamp-3">
                &ldquo;{shout.quote}&rdquo;
              </blockquote>
              <p className="mt-2 text-xs text-[var(--muted)]">— {shout.clientName}</p>
            </button>
          </Card>
        ))}
      </div>

      <AnimatePresence>
        {lightbox && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
              onClick={() => setLightbox(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 px-4"
            >
              <div className="card-kot rounded-xl p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase text-[var(--orange)]">
                      {lightbox.eventType}
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted)]">— {lightbox.clientName}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLightbox(null)}
                    className="text-[var(--muted)] hover:text-[var(--cream)]"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <blockquote className="mt-4 text-lg italic leading-relaxed text-[var(--cream)]">
                  &ldquo;{lightbox.quote}&rdquo;
                </blockquote>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
