import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request: Request) {
  const { type, name, content, imageUrl } = await request.json();

  if (!type || !content) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const sql = getDb();
  if (!sql) {
    return NextResponse.json({ success: true, fallback: true });
  }

  try {
    await sql`
      INSERT INTO community_submissions (type, name, content, image_url, status)
      VALUES (${type}, ${name || null}, ${content}, ${imageUrl || null}, 'pending')
    `;
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Submission error:", e);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
