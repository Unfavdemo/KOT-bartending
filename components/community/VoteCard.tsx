"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface VoteCardProps {
  id: string;
  name: string;
  description: string;
  initialVotes: number;
  voterFingerprint: string;
}

export function VoteCard({
  id,
  name,
  description,
  initialVotes,
  voterFingerprint,
}: VoteCardProps) {
  const [votes, setVotes] = useState(initialVotes);
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleVote() {
    if (voted || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/community/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId: id, voterFingerprint }),
      });
      const data = await res.json();
      if (res.ok) {
        setVotes(data.totalVotes ?? votes + 1);
        setVoted(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <h3 className="font-[family-name:var(--font-display)] text-lg font-bold uppercase text-[var(--cream)]">
        {name}
      </h3>
      <p className="mt-2 text-sm text-[var(--muted)]">{description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-2xl font-bold text-[var(--orange)]">{votes}</span>
        <Button
          variant={voted ? "outline" : "primary"}
          size="sm"
          onClick={handleVote}
          disabled={voted || loading}
        >
          {voted ? "Voted" : loading ? "..." : "Vote"}
        </Button>
      </div>
    </Card>
  );
}
