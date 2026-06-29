import { NextRequest, NextResponse } from "next/server";
import { assertAdminAuth } from "@/lib/admin-auth";
import { fetchEventInquiries } from "@/lib/inquiries-data";

export async function GET(request: NextRequest) {
  if (!assertAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const inquiries = await fetchEventInquiries();
    return NextResponse.json(inquiries, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    console.error("[admin/inquiries] GET failed:", error);
    return NextResponse.json({ error: "Failed to load inquiries" }, { status: 500 });
  }
}
