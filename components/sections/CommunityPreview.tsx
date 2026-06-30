"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calendar, ChefHat, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { fallbackEvents, fallbackRecipes } from "@/lib/sanity";

const tabs = [
  { id: "events", label: "Events", icon: Calendar, color: "orange" as const },
  { id: "recipes", label: "Recipes", icon: ChefHat, color: "yellow" as const },
  { id: "love", label: "Shout-Outs", icon: Heart, color: "neutral" as const },
];

export function CommunityPreview() {
  const [activeTab, setActiveTab] = useState("events");

  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Community Board"
            title="What's Happening"
            description="Local events, recipe highlights, and shout-outs from our KOT family."
          />
          <Button href="/community" variant="outline">
            View Board <ArrowRight className="h-4 w-4" />
          </Button>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mb-6 flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors sm:flex-none sm:px-4 sm:text-sm ${
                    isActive
                      ? "border-[var(--orange)] text-[var(--cream)]"
                      : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--border-orange)] hover:text-[var(--cream)]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="community-tab"
                      className="absolute inset-0 rounded-lg bg-[var(--orange)]/10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon className="relative h-4 w-4 shrink-0" />
                  <span className="relative">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === "events" && (
              <Card accent="orange">
                <div className="mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[var(--orange)]" />
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold uppercase">
                    Upcoming Events
                  </h3>
                </div>
                <ul className="grid gap-4 sm:grid-cols-2">
                  {fallbackEvents.map((event) => (
                    <li
                      key={event._id}
                      className="rounded-lg border border-[var(--border)] p-4 transition-colors hover:border-[var(--border-orange)]"
                    >
                      <Badge variant="orange" className="mb-2">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </Badge>
                      <p className="text-sm font-semibold text-[var(--cream)]">{event.title}</p>
                      <p className="text-xs text-[var(--muted)]">{event.venue}</p>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {activeTab === "recipes" && (
              <Card accent="yellow">
                <div className="mb-4 flex items-center gap-2">
                  <ChefHat className="h-5 w-5 text-[var(--yellow)]" />
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold uppercase">
                    Recipe Highlights
                  </h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {fallbackRecipes.map((recipe) => (
                    <div
                      key={recipe._id}
                      className="rounded-lg border border-[var(--border)] p-4 transition-colors hover:border-[var(--border-yellow)]"
                    >
                      <p className="text-sm font-semibold text-[var(--cream)]">{recipe.title}</p>
                      <p className="mt-2 text-xs text-[var(--muted)]">
                        {recipe.ingredients.join(" · ")}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === "love" && (
              <Card>
                <div className="mb-4 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-[var(--orange)]" />
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold uppercase">
                    Client Love
                  </h3>
                </div>
                <blockquote className="text-lg italic leading-relaxed text-[var(--cream)]">
                  &ldquo;The bartenders made our night unforgettable — every detail was
                  perfect!&rdquo;
                </blockquote>
                <p className="mt-3 text-sm text-[var(--orange)]">— Sarah M., Engagement Party</p>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
