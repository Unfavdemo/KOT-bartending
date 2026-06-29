"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Check, Users } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { getVoterFingerprint } from "@/lib/booking-prefill";

interface EventRsvpCardProps {
  id: string;
  title: string;
  date: string;
  venue: string;
  externalLink?: string | null;
  initialRsvps?: number;
  initialGuests?: number;
}

export function EventRsvpCard({
  id,
  title,
  date,
  venue,
  externalLink,
  initialRsvps = 0,
  initialGuests = 0,
}: EventRsvpCardProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [guests, setGuests] = useState(1);
  const [rsvps, setRsvps] = useState(initialRsvps);
  const [totalGuests, setTotalGuests] = useState(initialGuests);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/community/rsvp?eventId=${id}`);
        const data = await res.json();
        if (data[id]) {
          setRsvps(data[id].rsvps);
          setTotalGuests(data[id].guests);
        }
      } catch {
        /* ignore */
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [id]);

  async function handleRsvp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/community/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: id,
          name,
          email,
          guestCount: guests,
          voterFingerprint: getVoterFingerprint(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setRsvps(data.totalRsvps ?? rsvps + 1);
        setTotalGuests(data.totalGuests ?? totalGuests + guests);
        setSubmitted(true);
        setOpen(false);
      }
    } finally {
      setLoading(false);
    }
  }

  const formatted = new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card accent="orange">
      <Badge variant="orange" className="mb-3">
        {formatted}
      </Badge>
      <h3 className="font-[family-name:var(--font-display)] text-lg font-bold uppercase text-[var(--cream)]">
        {title}
      </h3>
      <p className="mt-1 text-sm text-[var(--muted)]">{venue}</p>

      <div className="mt-3 flex items-center gap-4 text-xs text-[var(--muted)]">
        <span className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5 text-[var(--orange)]" />
          {rsvps} RSVP{rsvps !== 1 ? "s" : ""} · {totalGuests} guest{totalGuests !== 1 ? "s" : ""}
        </span>
      </div>

      {externalLink && (
        <a
          href={externalLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-sm text-[var(--orange)] hover:text-[var(--yellow)]"
        >
          Learn more →
        </a>
      )}

      <AnimatePresence>
        {submitted ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 flex items-center gap-2 text-sm text-[var(--yellow)]"
          >
            <Check className="h-4 w-4" /> You&apos;re on the list!
          </motion.p>
        ) : open ? (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleRsvp}
            className="mt-4 space-y-3 border-t border-[var(--border)] pt-4"
          >
            <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Guests" type="number" min={1} max={10} value={guests} onChange={(e) => setGuests(Number(e.target.value))} />
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={loading} className="flex-1">
                {loading ? "..." : "Confirm RSVP"}
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </motion.form>
        ) : (
          <Button className="mt-4 w-full" size="sm" variant="secondary" onClick={() => setOpen(true)}>
            <Calendar className="h-4 w-4" /> RSVP to Event
          </Button>
        )}
      </AnimatePresence>
    </Card>
  );
}
