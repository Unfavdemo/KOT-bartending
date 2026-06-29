import { NextResponse } from "next/server";
import { hasDatabase } from "@/lib/db";
import {
  createScheduleBooking,
  fetchScheduleAvailability,
  isSlotAvailable,
} from "@/lib/schedule-data";
import { notifyScheduleBooking } from "@/lib/schedule-notify";
import {
  buildIcsEvent,
  formatSlotLabel,
  isValidScheduleRequest,
  type ScheduleRequest,
} from "@/lib/scheduling";

export async function GET() {
  try {
    const availability = await fetchScheduleAvailability();
    return NextResponse.json(availability, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    console.error("[schedule] GET failed:", error);
    return NextResponse.json(
      { error: "Failed to load availability" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!hasDatabase()) {
      return NextResponse.json(
        { error: "Scheduling is temporarily unavailable. Please email us directly." },
        { status: 503 },
      );
    }

    const body = (await request.json()) as ScheduleRequest;

    if (!isValidScheduleRequest(body)) {
      return NextResponse.json(
        { error: "Invalid scheduling request. Check name, email, date, and time." },
        { status: 400 },
      );
    }

    const available = await isSlotAvailable(body.date, body.time);
    if (!available) {
      return NextResponse.json(
        { error: "That time was just booked. Pick another slot." },
        { status: 409 },
      );
    }

    const booking = await createScheduleBooking({
      date: body.date,
      time: body.time,
      name: body.name.trim(),
      email: body.email.trim(),
      note: body.note?.trim(),
    });

    if (!booking) {
      return NextResponse.json(
        { error: "That time is no longer available. Pick another slot." },
        { status: 409 },
      );
    }

    const slotLabel = formatSlotLabel(body.date, body.time);
    const ics = buildIcsEvent({
      name: body.name.trim(),
      email: body.email.trim(),
      date: body.date,
      time: body.time,
      note: body.note?.trim(),
    });

    await notifyScheduleBooking({
      name: body.name.trim(),
      email: body.email.trim(),
      date: body.date,
      time: body.time,
      slotLabel,
      note: body.note?.trim(),
      ics,
    });

    return NextResponse.json({
      ok: true,
      slotLabel,
      ics,
      bookingId: booking.id,
      status: booking.status,
    });
  } catch (error) {
    console.error("[schedule] POST failed:", error);
    return NextResponse.json({ error: "Scheduling request failed" }, { status: 500 });
  }
}
