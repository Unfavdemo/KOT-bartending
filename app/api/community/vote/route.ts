import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request: Request) {
  const { optionId, voterFingerprint } = await request.json();

  if (!optionId || !voterFingerprint) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const sql = getDb();
  if (!sql) {
    return NextResponse.json({ totalVotes: 1, fallback: true });
  }

  try {
    await sql`
      INSERT INTO seasonal_votes (option_id, voter_fingerprint)
      VALUES (${optionId}, ${voterFingerprint})
      ON CONFLICT (option_id, voter_fingerprint) DO NOTHING
    `;

    const allCounts = await sql`
      SELECT option_id, COUNT(*)::int as count
      FROM seasonal_votes GROUP BY option_id
    `;
    const voteMap: Record<string, number> = {};
    for (const row of allCounts) {
      voteMap[row.option_id as string] = row.count as number;
    }

    const totalVotes = voteMap[optionId] ?? 1;
    return NextResponse.json({ totalVotes, counts: voteMap });
  } catch (e) {
    console.error("Vote error:", e);
    return NextResponse.json({ error: "Vote failed" }, { status: 500 });
  }
}

export async function GET() {
  const sql = getDb();
  if (!sql) {
    return NextResponse.json({});
  }

  try {
    const counts = await sql`
      SELECT option_id, COUNT(*)::int as count
      FROM seasonal_votes
      GROUP BY option_id
    `;
    const voteMap: Record<string, number> = {};
    for (const row of counts) {
      voteMap[row.option_id as string] = row.count as number;
    }
    return NextResponse.json(voteMap);
  } catch {
    return NextResponse.json({});
  }
}
