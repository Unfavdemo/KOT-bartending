import { Card } from "@/components/ui/Card";

interface ShoutOutCardProps {
  clientName: string;
  eventType: string;
  quote: string;
}

export function ShoutOutCard({ clientName, eventType, quote }: ShoutOutCardProps) {
  return (
    <Card accent="orange">
      <p className="text-xs font-bold uppercase tracking-wider text-[var(--orange)]">
        {eventType}
      </p>
      <blockquote className="mt-3 text-sm italic leading-relaxed text-[var(--cream)]">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <p className="mt-3 text-xs text-[var(--muted)]">— {clientName}</p>
    </Card>
  );
}
