import { NextRequest, NextResponse } from "next/server";
import { assertAdminAuth } from "@/lib/admin-auth";
import {
  cancelBooking,
  createBlockedSlot,
  fetchAllBookings,
  fetchBookingById,
  updateBookingStatus,
  type BookingStatus,
} from "@/lib/schedule-data";

export async function GET(request: NextRequest) {
  if (!assertAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const bookings = await fetchAllBookings();
    return NextResponse.json(bookings, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    console.error("[schedule/admin] GET failed:", error);
    return NextResponse.json({ error: "Failed to load bookings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!assertAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const action = String(body.action ?? "block");

    if (action === "block") {
      const date = String(body.date ?? "").trim();
      const time = String(body.time ?? "").trim();
      const label = String(body.label ?? "Unavailable").trim();

      if (!date || !time) {
        return NextResponse.json(
          { error: "date and time are required" },
          { status: 400 },
        );
      }

      const booking = await createBlockedSlot({
        date,
        time,
        label,
        note: body.note ? String(body.note) : undefined,
      });

      if (!booking) {
        return NextResponse.json({ error: "Slot already taken" }, { status: 409 });
      }

      return NextResponse.json(booking, { status: 201 });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("[schedule/admin] POST failed:", error);
    return NextResponse.json({ error: "Failed to create block" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!assertAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const id = String(body.id ?? "").trim();
    const status = body.status as BookingStatus | undefined;

    if (!id || !status) {
      return NextResponse.json(
        { error: "id and status are required" },
        { status: 400 },
      );
    }

    if (!["pending", "confirmed", "blocked", "cancelled"].includes(status)) {
      return NextResponse.json({ error: "invalid status" }, { status: 400 });
    }

    const updated = await updateBookingStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[schedule/admin] PATCH failed:", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!assertAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id")?.trim();
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const booking = await fetchBookingById(id);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const ok = await cancelBooking(id);
    if (!ok) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[schedule/admin] DELETE failed:", error);
    return NextResponse.json({ error: "Failed to cancel booking" }, { status: 500 });
  }
}
