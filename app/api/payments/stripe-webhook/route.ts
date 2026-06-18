import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import Stripe from "stripe";

type OrderUpdates = {
  stripePaymentStatus: "paid" | "failed" | "expired" | "unpaid";
  stripeLastEventType: string;
  stripePaidAt?: string;
  stripeAmountTotal?: number;
  stripePaymentIntentId?: string;
};

export const runtime = "nodejs";

async function updateOrderByCheckoutSessionId(
  checkoutSessionId: string,
  updates: OrderUpdates,
): Promise<boolean> {
  const dataDir = path.join(process.cwd(), ".data");
  const filePath = path.join(dataDir, "orders.jsonl");

  let content: string;

  try {
    content = await fs.readFile(filePath, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return false;
    }

    throw error;
  }

  const lines = content.split("\n");
  let foundMatch = false;

  const nextLines = lines.map((line) => {
    if (!line.trim()) {
      return line;
    }

    try {
      const parsed = JSON.parse(line) as Record<string, unknown>;

      if (parsed.stripeCheckoutSessionId !== checkoutSessionId) {
        return line;
      }

      foundMatch = true;

      const nextEntry = {
        ...parsed,
        ...updates,
        paymentUpdatedAt: new Date().toISOString(),
      };

      return JSON.stringify(nextEntry);
    } catch {
      return line;
    }
  });

  if (!foundMatch) {
    return false;
  }

  await fs.writeFile(filePath, `${nextLines.join("\n").replace(/\n+$/g, "")}\n`, "utf8");

  return true;
}

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey || !stripeWebhookSecret) {
    return NextResponse.json(
      {
        message:
          "Stripe webhook is not configured. Add STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET.",
      },
      { status: 500 },
    );
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ message: "Missing Stripe signature header." }, { status: 400 });
  }

  const body = await request.text();
  const stripe = new Stripe(stripeSecretKey);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, stripeWebhookSecret);
  } catch (error) {
    console.error("Invalid Stripe webhook signature", error);
    return NextResponse.json({ message: "Invalid webhook signature." }, { status: 400 });
  }

  try {
    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded" ||
      event.type === "checkout.session.async_payment_failed" ||
      event.type === "checkout.session.expired"
    ) {
      const session = event.data.object as Stripe.Checkout.Session;
      const sessionId = session.id;

      if (!sessionId) {
        return NextResponse.json({ received: true, updated: false });
      }

      const amountTotal =
        typeof session.amount_total === "number"
          ? Number((session.amount_total / 100).toFixed(2))
          : undefined;
      const paymentIntentId =
        typeof session.payment_intent === "string" ? session.payment_intent : undefined;

      let stripePaymentStatus: OrderUpdates["stripePaymentStatus"] = "unpaid";

      if (event.type === "checkout.session.expired") {
        stripePaymentStatus = "expired";
      } else if (event.type === "checkout.session.async_payment_failed") {
        stripePaymentStatus = "failed";
      } else if (
        event.type === "checkout.session.async_payment_succeeded" ||
        session.payment_status === "paid"
      ) {
        stripePaymentStatus = "paid";
      }

      const updates: OrderUpdates = {
        stripePaymentStatus,
        stripeLastEventType: event.type,
        stripeAmountTotal: amountTotal,
        stripePaymentIntentId: paymentIntentId,
        ...(stripePaymentStatus === "paid" ? { stripePaidAt: new Date().toISOString() } : {}),
      };

      const updated = await updateOrderByCheckoutSessionId(sessionId, updates);

      return NextResponse.json({ received: true, updated });
    }

    return NextResponse.json({ received: true, ignored: true });
  } catch (error) {
    console.error("Failed handling Stripe webhook", error);
    return NextResponse.json({ message: "Webhook handler failed." }, { status: 500 });
  }
}
