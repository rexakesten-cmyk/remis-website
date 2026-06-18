import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    return NextResponse.json(
      { message: "Stripe is not configured yet. Add STRIPE_SECRET_KEY to your environment." },
      { status: 500 },
    );
  }

  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id")?.trim();

  if (!sessionId) {
    return NextResponse.json({ message: "Missing session_id query parameter." }, { status: 400 });
  }

  try {
    const stripe = new Stripe(stripeSecretKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const amountTotal =
      typeof session.amount_total === "number"
        ? Number((session.amount_total / 100).toFixed(2))
        : undefined;
    const paid = session.payment_status === "paid";

    return NextResponse.json({
      sessionId: session.id,
      paid,
      paymentStatus: session.payment_status,
      amountTotal,
      customerEmail: session.customer_details?.email ?? null,
    });
  } catch (error) {
    console.error("Failed to retrieve Stripe session status", error);
    return NextResponse.json(
      { message: "Unable to verify Stripe session status." },
      { status: 500 },
    );
  }
}
