import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

type OrderType = "bagged" | "bulk";

type BaggedItem = {
  product: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

const BAGGED_PRICE_BY_PRODUCT: Record<string, number> = {
  "Cattle Blend": 19.5,
  "Poultry Pellets": 16.75,
  "Equine Mix": 21.25,
  "Sheep & Goat Blend": 18.5,
  "Swine Supplement": 20.0,
};

type OrderRequest = {
  orderType: OrderType;
  name: string;
  phone: string;
  email: string;
  farmName?: string;
  feedDetails?: string;
  baggedItems?: BaggedItem[];
  baggedSubtotal?: number;
  deliveryAddress?: string;
  timing?: string;
  notes?: string;
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
      const unitPrice = BAGGED_PRICE_BY_PRODUCT[product];
      const quantity =
        typeof quantityValue === "number"
          ? quantityValue
          : typeof quantityValue === "string"
            ? Number.parseInt(quantityValue, 10)
            : Number.NaN;

      if (!product || !Number.isInteger(quantity) || quantity <= 0 || typeof unitPrice !== "number") {
        return null;
      }

      const lineTotal = Number((quantity * unitPrice).toFixed(2));

      return { product, quantity, unitPrice, lineTotal };
    })
    .filter((item): item is BaggedItem => item !== null);
}

function parseOrder(body: unknown): OrderRequest | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const record = body as Record<string, unknown>;
  const orderType = normalizeText(record.orderType);
  const name = normalizeText(record.name);
  const phone = normalizeText(record.phone);
  const email = normalizeText(record.email);
  const farmName = normalizeText(record.farmName);
  const feedDetails = normalizeText(record.feedDetails);
  const baggedItems = parseBaggedItems(record.baggedItems);
  const baggedSubtotal = Number(
    baggedItems.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2),
  );
  const deliveryAddress = normalizeText(record.deliveryAddress);
  const timing = normalizeText(record.timing);
  const notes = normalizeText(record.notes);

  if (orderType !== "bagged" && orderType !== "bulk") {
    return null;
  }

  if (!name || !phone || !email) {
    return null;
  }

  if (orderType === "bagged" && baggedItems.length === 0) {
    return null;
  }

  if (orderType === "bulk" && !feedDetails) {
    return null;
  }

  if (orderType === "bulk" && !deliveryAddress) {
    return null;
  }

  return {
    orderType,
    name,
    phone,
    email,
    farmName,
    feedDetails,
    baggedItems,
    baggedSubtotal,
    deliveryAddress,
    timing,
    notes,
  };
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request payload." }, { status: 400 });
  }

  const order = parseOrder(body);

  if (!order) {
    return NextResponse.json(
      { message: "Please complete all required order fields." },
      { status: 400 },
    );
  }

  try {
    const dataDir = path.join(process.cwd(), ".data");
    const filePath = path.join(dataDir, "orders.jsonl");

    await fs.mkdir(dataDir, { recursive: true });

    const entry = {
      ...order,
      submittedAt: new Date().toISOString(),
    };

    await fs.appendFile(filePath, `${JSON.stringify(entry)}\n`, "utf8");

    return NextResponse.json({
      message: "Thanks, your order request was received. We will contact you shortly.",
    });
  } catch (error) {
    console.error("Failed to save order", error);
    return NextResponse.json(
      { message: "Order submission failed. Please call us at 660-971-0060." },
      { status: 500 },
    );
  }
}
