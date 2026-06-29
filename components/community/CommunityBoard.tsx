"use client";

import { EventRsvpCard } from "@/components/community/EventRsvpCard";
import { LiveVoteBoard } from "@/components/community/LiveVoteBoard";
import { RecipeCard } from "@/components/community/RecipeCard";
import { ShoutOutGallery } from "@/components/community/ShoutOutGallery";
import { SubmissionForm } from "@/components/community/SubmissionForm";

interface CommunityBoardProps {
  events: Array<{
    _id: string;
    title: string;
    date: string;
    venue: string;
    externalLink?: string | null;
  }>;
  recipes: Array<{
    _id: string;
    title: string;
    ingredients: string[];
    steps: string[];
    spiritPairings?: string[];
  }>;
  shoutOuts: Array<{
    _id: string;
    clientName: string;
    eventType: string;
    quote: string;
    imageUrl?: string | null;
  }>;
  menuOptions: Array<{ _id: string; name: string; description: string }>;
  voteCounts: Record<string, number>;
  rsvpCounts: Record<string, { rsvps: number; guests: number }>;
}

export function CommunityBoard({
  events,
  recipes,
  shoutOuts,
  menuOptions,
  voteCounts,
  rsvpCounts,
}: CommunityBoardProps) {
  return (
    <>
      <section className="mb-16">
        <h2 className="mb-6 font-[family-name:var(--font-display)] text-2xl font-bold uppercase text-[var(--orange)]">
          Upcoming Events
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventRsvpCard
              key={event._id}
              id={event._id}
              title={event.title}
              date={event.date}
              venue={event.venue}
              externalLink={event.externalLink}
              initialRsvps={rsvpCounts[event._id]?.rsvps ?? 0}
              initialGuests={rsvpCounts[event._id]?.guests ?? 0}
            />
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="mb-6 font-[family-name:var(--font-display)] text-2xl font-bold uppercase text-[var(--yellow)]">
          Recipe Highlights
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              title={recipe.title}
              ingredients={recipe.ingredients}
              steps={recipe.steps}
              spiritPairings={recipe.spiritPairings}
            />
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="mb-2 font-[family-name:var(--font-display)] text-2xl font-bold uppercase text-[var(--orange)]">
          Seasonal Menu Vote
        </h2>
        <p className="mb-6 text-sm text-[var(--muted)]">
          Help us pick the next seasonal cocktail — results update live!
        </p>
        <LiveVoteBoard
          options={menuOptions.map((o) => ({
            id: o._id,
            name: o.name,
            description: o.description,
          }))}
          initialCounts={voteCounts}
        />
      </section>

      <section>
        <h2 className="mb-6 font-[family-name:var(--font-display)] text-2xl font-bold uppercase text-[var(--cream)]">
          Client Shout-Outs
        </h2>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ShoutOutGallery
              shoutOuts={shoutOuts.map((s) => ({
                id: s._id,
                clientName: s.clientName,
                eventType: s.eventType,
                quote: s.quote,
                imageUrl: s.imageUrl,
              }))}
            />
          </div>
          <SubmissionForm />
        </div>
      </section>
    </>
  );
}
