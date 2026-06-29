import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getDb } from "@/lib/db";
import { siteConfig } from "@/lib/site-config";

export async function POST(request: Request) {
  const body = await request.json();

  const {
    eventDate,
    guestCount,
    eventType,
    spiritPreferences,
    spiritFree,
    menuNotes,
    name,
    email,
    phone,
    venue,
    message,
  } = body;

  if (!name || !email || !eventDate || !guestCount || !eventType || !venue) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const sql = getDb();
  if (sql) {
    try {
      await sql`
        INSERT INTO bookings (
          event_date, guest_count, event_type, spirit_preferences,
          spirit_free, menu_notes, name, email, phone, venue, message
        ) VALUES (
          ${eventDate}, ${guestCount}, ${eventType},
          ${JSON.stringify(spiritPreferences || [])},
          ${spiritFree || false}, ${menuNotes || null},
          ${name}, ${email}, ${phone || null}, ${venue}, ${message || null}
        )
      `;
    } catch (e) {
      console.error("Failed to save booking:", e);
    }
  }

  const resendKey = process.env.RESEND_API_KEY;
  const notifyEmail =
    process.env.BOOKING_NOTIFICATION_EMAIL || siteConfig.email;

  if (resendKey) {
    const resend = new Resend(resendKey);
    try {
      await resend.emails.send({
        from: "KOT Bookings <onboarding@resend.dev>",
        to: notifyEmail,
        replyTo: email,
        subject: `New Event Inquiry from ${name}`,
        html: `
          <h2>New Booking Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "N/A"}</p>
          <p><strong>Event Date:</strong> ${eventDate}</p>
          <p><strong>Guest Count:</strong> ${guestCount}</p>
          <p><strong>Event Type:</strong> ${eventType}</p>
          <p><strong>Venue:</strong> ${venue}</p>
          <p><strong>Spirits:</strong> ${(spiritPreferences || []).join(", ")}</p>
          <p><strong>Spirit-Free:</strong> ${spiritFree ? "Yes" : "No"}</p>
          <p><strong>Menu Notes:</strong> ${menuNotes || "N/A"}</p>
          <p><strong>Message:</strong> ${message || "N/A"}</p>
        `,
      });
    } catch (e) {
      console.error("Failed to send email:", e);
    }
  }

  return NextResponse.json({ success: true });
}
