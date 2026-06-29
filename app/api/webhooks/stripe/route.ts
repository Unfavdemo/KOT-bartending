import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getDb } from "@/lib/db";

export async function POST(request: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const stripe = new Stripe(stripeKey);
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const sql = getDb();

    if (sql) {
      try {
        await sql`
          INSERT INTO orders (stripe_session_id, email, items, total_cents)
          VALUES (
            ${session.id},
            ${session.customer_details?.email || null},
            ${JSON.stringify(session.line_items?.data || [])},
            ${session.amount_total || 0}
          )
          ON CONFLICT (stripe_session_id) DO NOTHING
        `;
      } catch (e) {
        console.error("Failed to log order:", e);
      }
    }
  }

  return NextResponse.json({ received: true });
}
