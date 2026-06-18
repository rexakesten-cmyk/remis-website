import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

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

function splitCustomerName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim();

  if (!trimmed) {
    return { firstName: "Customer", lastName: "" };
  }

  const parts = trimmed.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "" };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

function buildFeedDetails(items: BaggedItem[]): string {
  return items.map((item) => `${item.quantity} bags of ${item.product}`).join(", ");
}

function getAuthorizeApiBaseUrl(environment: string): string {
  return environment === "production"
    ? "https://api2.authorize.net"
    : "https://apitest.authorize.net";
}

function getAuthorizeCheckoutUrl(environment: string): string {
  return environment === "production"
    ? "https://accept.authorize.net/payment/payment"
    : "https://test.authorize.net/payment/payment";
}

export const runtime = "nodejs";

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

  const apiLoginId = process.env.AUTHORIZE_NET_API_LOGIN_ID;
  const transactionKey = process.env.AUTHORIZE_NET_TRANSACTION_KEY;
  const environment = (process.env.AUTHORIZE_NET_ENVIRONMENT ?? "sandbox").toLowerCase();

  if (!apiLoginId || !transactionKey) {
    return NextResponse.json(
      {
        message:
          "Authorize.Net is not configured. Add AUTHORIZE_NET_API_LOGIN_ID and AUTHORIZE_NET_TRANSACTION_KEY.",
      },
      { status: 500 },
    );
  }

  if (environment !== "sandbox" && environment !== "production") {
    return NextResponse.json(
      { message: "AUTHORIZE_NET_ENVIRONMENT must be either 'sandbox' or 'production'." },
      { status: 500 },
    );
  }

  const amount = checkoutRequest.baggedSubtotal.toFixed(2);
  const invoiceNumber = `ORD-${Date.now()}`;
  const referenceId = randomUUID();
  const origin = new URL(request.url).origin;
  const returnUrl = `${origin}/order-feed?checkout=success`;
  const cancelUrl = `${origin}/order-feed?checkout=cancelled`;
  const feedDetails = buildFeedDetails(checkoutRequest.baggedItems);
  const { firstName, lastName } = splitCustomerName(checkoutRequest.name);

  const payload = {
    getHostedPaymentPageRequest: {
      merchantAuthentication: {
        name: apiLoginId,
        transactionKey,
      },
      refId: referenceId,
      transactionRequest: {
        transactionType: "authCaptureTransaction",
        amount,
        order: {
          invoiceNumber,
          description: feedDetails.slice(0, 255),
        },
        customer: {
          email: checkoutRequest.email,
        },
        billTo: {
          firstName,
          lastName,
          company: checkoutRequest.farmName || undefined,
        },
        lineItems: {
          lineItem: checkoutRequest.baggedItems.map((item) => ({
            itemId: item.product.slice(0, 31),
            name: item.product.slice(0, 31),
            description: `${item.product} bagged feed`,
            quantity: String(item.quantity),
            unitPrice: item.unitPrice.toFixed(2),
          })),
        },
      },
      hostedPaymentSettings: {
        setting: [
          {
            settingName: "hostedPaymentReturnOptions",
            settingValue: JSON.stringify({
              showReceipt: false,
              url: returnUrl,
              urlText: "Return to Kesten Feed Co",
              cancelUrl,
              cancelUrlText: "Cancel and return",
            }),
          },
          {
            settingName: "hostedPaymentButtonOptions",
            settingValue: JSON.stringify({ text: "Pay" }),
          },
          {
            settingName: "hostedPaymentStyleOptions",
            settingValue: JSON.stringify({ bgColor: "#f9f5ef" }),
          },
          {
            settingName: "hostedPaymentOrderOptions",
            settingValue: JSON.stringify({ show: true, merchantName: "Kesten Feed Co" }),
          },
          {
            settingName: "hostedPaymentPaymentOptions",
            settingValue: JSON.stringify({
              cardCodeRequired: true,
              showCreditCard: true,
              showBankAccount: false,
            }),
          },
          {
            settingName: "hostedPaymentBillingAddressOptions",
            settingValue: JSON.stringify({ show: true, required: false }),
          },
        ],
      },
    },
  };

  try {
    const apiBaseUrl = getAuthorizeApiBaseUrl(environment);
    const response = await fetch(`${apiBaseUrl}/xml/v1/request.api`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const result = (await response.json()) as {
      messages?: { resultCode?: string; message?: Array<{ text?: string }> };
      token?: string;
    };

    if (!response.ok || result.messages?.resultCode !== "Ok" || !result.token) {
      const gatewayMessage = result.messages?.message?.[0]?.text;
      throw new Error(gatewayMessage ?? "Authorize.Net did not return a hosted payment token.");
    }

    const dataDir = path.join(process.cwd(), ".data");
    const filePath = path.join(dataDir, "orders.jsonl");

    await fs.mkdir(dataDir, { recursive: true });

    const entry = {
      ...checkoutRequest,
      feedDetails,
      authorizeNetInvoiceNumber: invoiceNumber,
      authorizeNetRefId: referenceId,
      authorizeNetEnvironment: environment,
      authorizeNetPaymentStatus: "pending",
      submittedAt: new Date().toISOString(),
    };

    await fs.appendFile(filePath, `${JSON.stringify(entry)}\n`, "utf8");

    return NextResponse.json({
      checkoutUrl: getAuthorizeCheckoutUrl(environment),
      token: result.token,
    });
  } catch (error) {
    console.error("Failed to create Authorize.Net hosted payment session", error);
    return NextResponse.json(
      {
        message:
          "Could not start Authorize.Net checkout. Please try again or call 660-971-0060.",
      },
      { status: 500 },
    );
  }
}