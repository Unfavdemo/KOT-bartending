import { NextRequest, NextResponse } from "next/server";
import { assertAdminAuth } from "@/lib/admin-auth";
import { deleteEventInquiry, fetchEventInquiries } from "@/lib/inquiries-data";

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

export async function DELETE(request: NextRequest) {
  if (!assertAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = Number(new URL(request.url).searchParams.get("id"));
    if (!Number.isInteger(id) || id < 1) {
      return NextResponse.json({ error: "Valid id is required" }, { status: 400 });
    }

    const ok = await deleteEventInquiry(id);
    if (!ok) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin/inquiries] DELETE failed:", error);
    return NextResponse.json({ error: "Failed to delete inquiry" }, { status: 500 });
  }
}
