"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";

export function SubmissionForm() {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/community/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "shout-out", name, content }),
      });
      if (res.ok) setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <Card>
        <p className="text-sm text-[var(--orange)]">
          Thank you! Your shout-out has been submitted for review.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="font-[family-name:var(--font-display)] text-lg font-bold uppercase text-[var(--cream)]">
        Share Your Experience
      </h3>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <Input
          label="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Textarea
          label="Your Shout-Out"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Tell us about your KOT experience..."
          required
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Submitting..." : "Submit Shout-Out"}
        </Button>
      </form>
    </Card>
  );
}
