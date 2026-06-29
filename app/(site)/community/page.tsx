import { CommunityBoard } from "@/components/community/CommunityBoard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getDb } from "@/lib/db";
import {
  sanityClient,
  isSanityConfigured,
  eventsQuery,
  recipesQuery,
  shoutOutsQuery,
  menuOptionsQuery,
  fallbackEvents,
  fallbackRecipes,
  fallbackShoutOuts,
  fallbackMenuOptions,
} from "@/lib/sanity";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Board",
  description:
    "Local events, cocktail recipes, seasonal menu voting, and client shout-outs from the KOT community.",
};

async function getVoteCounts(): Promise<Record<string, number>> {
  const sql = getDb();
  if (!sql) return {};
  try {
    const counts = await sql`
      SELECT option_id, COUNT(*)::int as count
      FROM seasonal_votes GROUP BY option_id
    `;
    const map: Record<string, number> = {};
    for (const row of counts) {
      map[row.option_id as string] = row.count as number;
    }
    return map;
  } catch {
    return {};
  }
}

async function getRsvpCounts(): Promise<Record<string, { rsvps: number; guests: number }>> {
  const sql = getDb();
  if (!sql) return {};
  try {
    const rows = await sql`
      SELECT event_id, COUNT(*)::int as total, COALESCE(SUM(guest_count), 0)::int as guests
      FROM event_rsvps GROUP BY event_id
    `;
    const map: Record<string, { rsvps: number; guests: number }> = {};
    for (const row of rows) {
      map[row.event_id as string] = {
        rsvps: row.total as number,
        guests: row.guests as number,
      };
    }
    return map;
  } catch {
    return {};
  }
}

async function getCommunityData() {
  if (!isSanityConfigured) {
    return {
      events: fallbackEvents,
      recipes: fallbackRecipes,
      shoutOuts: fallbackShoutOuts,
      menuOptions: fallbackMenuOptions,
    };
  }

  try {
    const [events, recipes, shoutOuts, menuOptions] = await Promise.all([
      sanityClient.fetch(eventsQuery),
      sanityClient.fetch(recipesQuery),
      sanityClient.fetch(shoutOutsQuery),
      sanityClient.fetch(menuOptionsQuery),
    ]);
    return {
      events: events?.length ? events : fallbackEvents,
      recipes: recipes?.length ? recipes : fallbackRecipes,
      shoutOuts: shoutOuts?.length ? shoutOuts : fallbackShoutOuts,
      menuOptions: menuOptions?.length ? menuOptions : fallbackMenuOptions,
    };
  } catch {
    return {
      events: fallbackEvents,
      recipes: fallbackRecipes,
      shoutOuts: fallbackShoutOuts,
      menuOptions: fallbackMenuOptions,
    };
  }
}

export default async function CommunityPage() {
  const [data, voteCounts, rsvpCounts] = await Promise.all([
    getCommunityData(),
    getVoteCounts(),
    getRsvpCounts(),
  ]);

  const menuOptions = data.menuOptions.map(
    (o: { _id: string; name: string; description: string }) => ({
      _id: o._id,
      name: o.name,
      description: o.description,
    }),
  );

  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Community Board"
          title="The KOT Bulletin"
          description="RSVP to events, vote on seasonal cocktails, and celebrate with our community — all live."
          className="mb-16"
        />

        <CommunityBoard
          events={data.events}
          recipes={data.recipes}
          shoutOuts={data.shoutOuts}
          menuOptions={menuOptions}
          voteCounts={voteCounts}
          rsvpCounts={rsvpCounts}
        />
      </div>
    </div>
  );
}
