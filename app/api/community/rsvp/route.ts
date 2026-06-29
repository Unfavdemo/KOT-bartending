import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request: Request) {
  const { eventId, name, email, guestCount, voterFingerprint } = await request.json();

  if (!eventId || !name || !email) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const sql = getDb();
  if (!sql) {
    return NextResponse.json({ success: true, totalRsvps: 1, fallback: true });
  }

  try {
    await sql`
      INSERT INTO event_rsvps (event_id, name, email, guest_count, voter_fingerprint)
      VALUES (${eventId}, ${name}, ${email}, ${guestCount || 1}, ${voterFingerprint || null})
      ON CONFLICT (event_id, email) DO UPDATE SET guest_count = ${guestCount || 1}
    `;

    const counts = await sql`
      SELECT COUNT(*)::int as total, COALESCE(SUM(guest_count), 0)::int as guests
      FROM event_rsvps WHERE event_id = ${eventId}
    `;

    return NextResponse.json({
      success: true,
      totalRsvps: counts[0]?.total ?? 1,
      totalGuests: counts[0]?.guests ?? 1,
    });
  } catch (e) {
    console.error("RSVP error:", e);
    return NextResponse.json({ error: "RSVP failed" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get("eventId");

  const sql = getDb();
  if (!sql) return NextResponse.json({});

  try {
    if (eventId) {
      const counts = await sql`
        SELECT COUNT(*)::int as total, COALESCE(SUM(guest_count), 0)::int as guests
        FROM event_rsvps WHERE event_id = ${eventId}
      `;
      return NextResponse.json({
        [eventId]: { rsvps: counts[0]?.total ?? 0, guests: counts[0]?.guests ?? 0 },
      });
    }

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
    return NextResponse.json(map);
  } catch {
    return NextResponse.json({});
  }
}
