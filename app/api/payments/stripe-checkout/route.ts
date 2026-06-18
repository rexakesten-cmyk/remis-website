import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import Stripe from "stripe";

type BaggedItem = {
  product: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

type CheckoutRequest = {
  orderType: "bagged";
  name: string;
  phone: string;
  email: string;
  farmName?: string;
  baggedItems: BaggedItem[];
  baggedSubtotal: number;
  timing?: string;
  notes?: string;
};

const BAGGED_PRICE_BY_PRODUCT: Record<string, number> = {
  "Cattle Blend": 19.5,
  "Poultry Pellets": 16.75,
  "Equine Mix": 21.25,
  "Sheep & Goat Blend": 18.5,
  "Swine Supplement": 20.0,
};

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function parseBaggedItems(value: unknown): BaggedItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => {
      if (!entry || typeof entry !== "object") {
        return null;
      }

      const record = entry as Record<string, unknown>;
      const product = normalizeText(record.product);
      const quantityValue = record.quantity;
      const quantity =
        typeof quantityValue === "number"
          ? quantityValue
          : typeof quantityValue === "string"
            ? Number.parseInt(quantityValue, 10)
            : Number.NaN;
      const unitPrice = BAGGED_PRICE_BY_PRODUCT[product];

      if (!product || !Number.isInteger(quantity) || quantity <= 0 || typeof unitPrice !== "number") {
        return null;
      }

      const lineTotal = Number((quantity * unitPrice).toFixed(2));

      return {
        product,
        quantity,
        unitPrice,
        lineTotal,
      };
    })
    .filter((item): item is BaggedItem => item !== null);
}

function parseCheckoutRequest(body: unknown): CheckoutRequest | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const record = body as Record<string, unknown>;
  const orderType = normalizeText(record.orderType);
  const name = normalizeText(record.name);
  const phone = normalizeText(record.phone);
  const email = normalizeText(record.email);
  const farmName = normalizeText(record.farmName);
  const timing = normalizeText(record.timing);
  const notes = normalizeText(record.notes);
  const baggedItems = parseBaggedItems(record.baggedItems);

  if (orderType !== "bagged") {
    return null;
  }

  if (!name || !phone || !email || baggedItems.length === 0) {
    return null;
  }

  const baggedSubtotal = Number(
    baggedItems.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2),
  );

  return {
    orderType: "bagged",
    name,
    phone,
    email,
    farmName,
    baggedItems,
    baggedSubtotal,
    timing,
    notes,
  };
}

function buildFeedDetails(items: BaggedItem[]): string {
  return items.map((item) => `${item.quantity} bags of ${item.product}`).join(", ");
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request payload." }, { status: 400 });
  }

  const checkoutRequest = parseCheckoutRequest(body);

  if (!checkoutRequest) {
    return NextResponse.json(
      { message: "Please complete all required bagged order fields." },
      { status: 400 },
    );
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    return NextResponse.json(
      { message: "Stripe is not configured yet. Add STRIPE_SECRET_KEY to your environment." },
      { status: 500 },
    );
  }

  try {
    const stripe = new Stripe(stripeSecretKey);
    const origin = new URL(request.url).origin;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: checkoutRequest.email,
      line_items: checkoutRequest.baggedItems.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(item.unitPrice * 100),
          product_data: {
            name: item.product,
          },
        },
      })),
      success_url: `${origin}/order-feed?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/order-feed?checkout=cancelled`,
      metadata: {
        orderType: checkoutRequest.orderType,
        customerName: checkoutRequest.name,
        customerEmail: checkoutRequest.email,
        phone: checkoutRequest.phone,
        farmName: checkoutRequest.farmName || "",
        timing: checkoutRequest.timing || "",
      },
    });

    const dataDir = path.join(process.cwd(), ".data");
    const filePath = path.join(dataDir, "orders.jsonl");

    await fs.mkdir(dataDir, { recursive: true });

    const entry = {
      ...checkoutRequest,
      feedDetails: buildFeedDetails(checkoutRequest.baggedItems),
      stripeCheckoutSessionId: session.id,
      stripePaymentStatus: "pending",
      submittedAt: new Date().toISOString(),
    };

    await fs.appendFile(filePath, `${JSON.stringify(entry)}\n`, "utf8");

    if (!session.url) {
      return NextResponse.json(
        { message: "Stripe session was created but no checkout link was returned." },
        { status: 500 },
      );
    }

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error("Failed to create Stripe checkout session", error);
    return NextResponse.json(
      { message: "Could not start Stripe checkout. Please try again or call 660-971-0060." },
      { status: 500 },
    );
  }
}
