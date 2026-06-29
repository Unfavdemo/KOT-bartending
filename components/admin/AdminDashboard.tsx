"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { EventInquiries } from "@/components/admin/EventInquiries";
import { ScheduleAdmin } from "@/components/admin/ScheduleAdmin";
import { adminFetch } from "@/lib/admin-fetch";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Calendar, ClipboardList, LogOut } from "lucide-react";

const navItems = [
  {
    id: "schedule" as const,
    label: "Planning calendar",
    description: "Calls, confirmations & blocked slots",
    icon: Calendar,
  },
  {
    id: "inquiries" as const,
    label: "Event inquiries",
    description: "Full quote requests from the site",
    icon: ClipboardList,
  },
];

export function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<"schedule" | "inquiries">("schedule");
  const [message, setMessage] = useState<string | null>(null);
  const [pendingCalls, setPendingCalls] = useState(0);

  const checkSession = useCallback(async () => {
    try {
      const res = await adminFetch("/api/admin/session");
      const data = (await res.json()) as { authenticated?: boolean };
      setAuthenticated(Boolean(data.authenticated));
    } catch {
      setAuthenticated(false);
    } finally {
      setChecking(false);
    }
  }, []);

  const loadPendingCount = useCallback(async () => {
    try {
      const res = await adminFetch("/api/schedule/admin");
      if (!res.ok) return;
      const bookings = (await res.json()) as { status: string; kind: string }[];
      setPendingCalls(
        bookings.filter((b) => b.kind === "consultation" && b.status === "pending").length,
      );
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    void checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (authenticated) void loadPendingCount();
  }, [authenticated, loadPendingCount, activeTab]);

  async function signOut() {
    await adminFetch("/api/admin/session", { method: "DELETE" });
    setAuthenticated(false);
    setMessage(null);
  }

  function onMessage(msg: string) {
    setMessage(msg);
    void loadPendingCount();
    window.setTimeout(() => setMessage(null), 5000);
  }

  if (checking) {
    return (
      <div className="py-20 text-center text-sm text-[var(--muted)]">
        Checking session…
      </div>
    );
  }

  if (!authenticated) {
    return <AdminLogin onAuthenticated={() => setAuthenticated(true)} />;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start">
      <aside className="card-kot rounded-xl p-4 lg:sticky lg:top-24">
        <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
          KOT Admin
        </p>
        <nav className="mt-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            const badge = item.id === "schedule" && pendingCalls > 0 ? pendingCalls : null;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition-colors",
                  active
                    ? "bg-[var(--orange)]/15 text-[var(--cream)]"
                    : "text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--cream)]",
                )}
              >
                <Icon
                  className={cn(
                    "mt-0.5 h-4 w-4 shrink-0",
                    active ? "text-[var(--orange)]" : "text-[var(--yellow)]",
                  )}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    {item.label}
                    {badge != null && (
                      <span className="rounded-full bg-[var(--orange)] px-1.5 py-0.5 text-[10px] font-bold text-black">
                        {badge}
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-snug opacity-80">
                    {item.description}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-4 w-full justify-start gap-2 normal-case"
          onClick={() => void signOut()}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </aside>

      <div className="min-w-0 space-y-6">
        {message && (
          <p
            className="rounded-lg border border-[var(--border-orange)] bg-[var(--orange)]/10 px-4 py-3 text-sm text-[var(--cream)]"
            role="status"
          >
            {message}
          </p>
        )}

        {activeTab === "schedule" ? (
          <ScheduleAdmin onMessage={onMessage} />
        ) : (
          <EventInquiries onMessage={onMessage} />
        )}
      </div>
    </div>
  );
}
