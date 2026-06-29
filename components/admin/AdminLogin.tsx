"use client";

import Link from "next/link";
import { useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import { Button } from "@/components/ui/Button";

type AdminLoginProps = {
  onAuthenticated: () => void;
};

export function AdminLogin({ onAuthenticated }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) return;

    setError(null);
    setBusy(true);
    try {
      const res = await adminFetch("/api/admin/session", {
        method: "POST",
        body: JSON.stringify({ password: password.trim() }),
      });
      if (!res.ok) {
        setError("Invalid password.");
        return;
      }
      setPassword("");
      onAuthenticated();
    } catch {
      setError("Could not sign in.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <Link
        href="/"
        className="text-sm text-[var(--muted)] transition hover:text-[var(--orange)]"
      >
        ← Back to website
      </Link>
      <form onSubmit={(e) => void handleSubmit(e)} className="card-kot mt-6 rounded-xl p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--orange)]">
          Internal
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold uppercase text-[var(--cream)]">
          Admin access
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Sign in to manage the planning calendar and event inquiries.
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="kot-input mt-6"
          placeholder="Admin password"
          autoComplete="current-password"
        />
        {error && (
          <p className="mt-3 text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" className="mt-4 w-full" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
