"use client";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  venue: string;
  externalLink?: string | null;
}

export function EventCard({ title, date, venue, externalLink }: EventCardProps) {
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
      {externalLink && (
        <a
          href={externalLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm text-[var(--orange)] hover:text-[var(--yellow)]"
        >
          Learn more →
        </a>
      )}
    </Card>
  );
}
