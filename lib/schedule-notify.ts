import { Resend } from "resend";
import { buildCalendarLinks } from "@/lib/calendar-links";
import { siteConfig } from "@/lib/site-config";

export type ScheduleNotification = {
  name: string;
  email: string;
  date: string;
  time: string;
  slotLabel: string;
  note?: string;
  ics: string;
};

export async function notifyScheduleBooking(
  data: ScheduleNotification,
): Promise<{ studio: boolean; client: boolean }> {
  const result = { studio: false, client: false };
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return result;

  const notifyEmail =
    process.env.BOOKING_NOTIFICATION_EMAIL || siteConfig.email;
  const resend = new Resend(resendKey);
  const from = `${siteConfig.shortName} Bookings <onboarding@resend.dev>`;

  const studioHtml = `
    <h2>Planning call requested</h2>
    <p><strong>${data.name}</strong> (${data.email}) booked a planning call.</p>
    <table style="border-collapse:collapse;margin-top:16px">
      <tr><td style="padding:8px;border:1px solid #eee;font-weight:600">When</td><td style="padding:8px;border:1px solid #eee">${data.slotLabel}</td></tr>
      ${data.note ? `<tr><td style="padding:8px;border:1px solid #eee;font-weight:600">Note</td><td style="padding:8px;border:1px solid #eee">${data.note.replace(/\n/g, "<br>")}</td></tr>` : ""}
    </table>
    <p style="margin-top:16px;color:#666">Confirm or propose another time within one business day.</p>
  `;

  try {
    await resend.emails.send({
      from,
      to: notifyEmail,
      replyTo: data.email,
      subject: `[Schedule] Planning call — ${data.name} · ${data.slotLabel}`,
      html: studioHtml,
      attachments: [{ filename: "planning-call.ics", content: Buffer.from(data.ics) }],
    });
    result.studio = true;
  } catch (e) {
    console.error("[schedule] Studio notification failed:", e);
  }

  const links = buildCalendarLinks({
    name: data.name,
    email: data.email,
    date: data.date,
    time: data.time,
    note: data.note,
  });

  const firstName = data.name.split(" ")[0];
  const clientHtml = `
    <h2>Thanks, ${firstName}!</h2>
    <p>We received your planning call request for <strong>${data.slotLabel}</strong>.</p>
    <p>We'll confirm this time — or suggest a nearby slot — within one business day.</p>
    ${data.note ? `<p style="color:#666"><em>Your note: ${data.note.replace(/\n/g, "<br>")}</em></p>` : ""}
    <p style="margin-top:20px"><strong>Add to your calendar:</strong></p>
    <p>
      <a href="${links.google}">Google Calendar</a> ·
      <a href="${links.outlook}">Outlook</a> ·
      <a href="${links.yahoo}">Yahoo</a>
    </p>
    <p style="margin-top:16px;color:#666">Questions? Reply to this email or reach us at ${siteConfig.email}.</p>
  `;

  try {
    await resend.emails.send({
      from,
      to: data.email,
      replyTo: notifyEmail,
      subject: `Your ${siteConfig.shortName} planning call — ${data.slotLabel}`,
      html: clientHtml,
      attachments: [{ filename: "planning-call.ics", content: Buffer.from(data.ics) }],
    });
    result.client = true;
  } catch (e) {
    console.error("[schedule] Client notification failed:", e);
  }

  return result;
}
