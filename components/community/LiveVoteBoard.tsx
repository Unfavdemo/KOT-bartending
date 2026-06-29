"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getVoterFingerprint } from "@/lib/booking-prefill";

export interface VoteOption {
  id: string;
  name: string;
  description: string;
}

interface LiveVoteBoardProps {
  options: VoteOption[];
  initialCounts: Record<string, number>;
}

export function LiveVoteBoard({ options, initialCounts }: LiveVoteBoardProps) {
  const [counts, setCounts] = useState(initialCounts);
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<string | null>(null);
  const [leaderId, setLeaderId] = useState<string | null>(null);

  const fingerprint = typeof window !== "undefined" ? getVoterFingerprint() : "anonymous";

  const refreshCounts = useCallback(async () => {
    try {
      const res = await fetch("/api/community/vote");
      const data = await res.json();
      setCounts((prev) => ({ ...prev, ...data }));
    } catch {
      /* keep existing */
    }
  }, []);

  useEffect(() => {
    setCounts((prev) => ({ ...prev, ...initialCounts }));
    const interval = setInterval(refreshCounts, 8000);
    return () => clearInterval(interval);
  }, [initialCounts, refreshCounts]);

  const totalVotes = options.reduce((sum, o) => sum + (counts[o.id] || 0), 0);

  useEffect(() => {
    if (totalVotes === 0) {
      setLeaderId(null);
      return;
    }
    const leader = options.reduce((best, o) =>
      (counts[o.id] || 0) > (counts[best.id] || 0) ? o : best,
    );
    setLeaderId(leader.id);
  }, [counts, options, totalVotes]);

  async function handleVote(optionId: string) {
    if (votedIds.has(optionId) || loading) return;
    setLoading(optionId);
    try {
      const res = await fetch("/api/community/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId, voterFingerprint: fingerprint }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.counts) setCounts(data.counts);
        else setCounts((prev) => ({ ...prev, [optionId]: data.totalVotes ?? (prev[optionId] || 0) + 1 }));
        setVotedIds((prev) => new Set([...prev, optionId]));
      }
    } finally {
      setLoading(null);
    }
  }

  const leader = options.find((o) => o.id === leaderId);

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {leader && totalVotes > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 rounded-xl border border-[var(--border-yellow)] bg-[var(--yellow)]/10 px-4 py-3"
          >
            <Crown className="h-5 w-5 shrink-0 text-[var(--yellow)]" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--yellow)]">
                Currently Leading
              </p>
              <p className="text-sm font-semibold text-[var(--cream)]">{leader.name}</p>
            </div>
            <span className="ml-auto text-lg font-bold text-[var(--orange)]">
              {counts[leader.id] || 0} votes
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4 sm:grid-cols-3">
        {options.map((option) => {
          const votes = counts[option.id] || 0;
          const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
          const isLeader = option.id === leaderId && totalVotes > 0;
          const hasVoted = votedIds.has(option.id);

          return (
            <Card
              key={option.id}
              accent={isLeader ? "yellow" : "none"}
              className={isLeader ? "ring-1 ring-[var(--yellow)]/30" : ""}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold uppercase text-[var(--cream)]">
                  {option.name}
                </h3>
                {isLeader && <TrendingUp className="h-4 w-4 shrink-0 text-[var(--yellow)]" />}
              </div>
              <p className="mt-1 text-sm text-[var(--muted)]">{option.description}</p>

              <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-[var(--orange)] font-bold">{votes} votes</span>
                  <span className="text-[var(--muted)]">{pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[var(--surface)]">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--orange)] to-[var(--yellow)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>

              <Button
                className="mt-4 w-full"
                size="sm"
                variant={hasVoted ? "outline" : "primary"}
                onClick={() => handleVote(option.id)}
                disabled={hasVoted || loading === option.id}
              >
                {hasVoted ? "Voted ✓" : loading === option.id ? "..." : "Cast Vote"}
              </Button>
            </Card>
          );
        })}
      </div>

      <p className="text-center text-xs text-[var(--muted)]">
        {totalVotes} total vote{totalVotes !== 1 ? "s" : ""} · Updates live every 8 seconds
      </p>
    </div>
  );
}
