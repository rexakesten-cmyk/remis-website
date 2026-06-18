import { createHmac, timingSafeEqual } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

type AuthorizePaymentStatus = "pending" | "paid" | "failed" | "refunded" | "voided";

type OrderUpdates = {
  authorizeNetPaymentStatus: AuthorizePaymentStatus;
  authorizeNetLastEventType: string;
  authorizeNetTransactionId?: string;
  authorizeNetTransactionStatus?: string;
  authorizeNetAmount?: number;
  authorizeNetPaidAt?: string;
};

type AuthorizeWebhookPayload = {
  webhookId?: string;
  eventType?: string;
  payload?: {
    id?: string | number;
    responseCode?: string | number;
    authAmount?: string | number;
  };
};

function getAuthorizeApiBaseUrl(environment: string): string {
  return environment === "production"
    ? "https://api2.authorize.net"
    : "https://apitest.authorize.net";
}

function parseNumericAmount(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Number(value.toFixed(2));
  }

  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);

    if (Number.isFinite(parsed)) {
      return Number(parsed.toFixed(2));
    }
  }

  return undefined;
}

function parseString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function getStatusFromEventType(eventType: string, responseCode?: string | number): AuthorizePaymentStatus {
  const normalizedEvent = eventType.toLowerCase();
  const response = String(responseCode ?? "");

  if (normalizedEvent.includes("refund")) {
    return "refunded";
  }

  if (normalizedEvent.includes("void")) {
    return "voided";
  }

  if (normalizedEvent.includes("authcapture") || normalizedEvent.includes("capture")) {
    return response && response !== "1" ? "failed" : "paid";
  }

  if (response && response !== "1") {
    return "failed";
  }

  return "pending";
}

function verifyWebhookSignature(rawBody: string, signatureHeader: string | null, signatureKey: string): boolean {
  if (!signatureHeader) {
    return false;
  }

  const parts = signatureHeader.split("=");

  if (parts.length !== 2) {
    return false;
  }

  const [algorithm, digest] = parts;

  if (algorithm.toLowerCase() !== "sha512") {
    return false;
  }

  const expectedDigest = createHmac("sha512", signatureKey).update(rawBody, "utf8").digest("hex");

  try {
    return timingSafeEqual(Buffer.from(digest.toLowerCase(), "hex"), Buffer.from(expectedDigest, "hex"));
  } catch {
    return false;
  }
}

async function fetchTransactionDetails(args: {
  environment: string;
  apiLoginId: string;
  transactionKey: string;
  transactionId: string;
}): Promise<{ invoiceNumber?: string; transactionStatus?: string; amount?: number }> {
  const { environment, apiLoginId, transactionKey, transactionId } = args;

  const response = await fetch(`${getAuthorizeApiBaseUrl(environment)}/xml/v1/request.api`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      getTransactionDetailsRequest: {
        merchantAuthentication: {
          name: apiLoginId,
          transactionKey,
        },
        transId: transactionId,
      },
    }),
    cache: "no-store",
  });

  const result = (await response.json()) as {
    messages?: { resultCode?: string; message?: Array<{ text?: string }> };
    transaction?: {
      transactionStatus?: string;
      authAmount?: string | number;
      settleAmount?: string | number;
      order?: {
        invoiceNumber?: string;
      };
    };
  };

  if (!response.ok || result.messages?.resultCode !== "Ok" || !result.transaction) {
    const gatewayMessage = result.messages?.message?.[0]?.text;
    throw new Error(gatewayMessage ?? "Unable to fetch Authorize.Net transaction details.");
  }

  const invoiceNumber = parseString(result.transaction.order?.invoiceNumber);
  const transactionStatus = parseString(result.transaction.transactionStatus);
  const amount =
    parseNumericAmount(result.transaction.settleAmount) ??
    parseNumericAmount(result.transaction.authAmount);

  return {
    invoiceNumber: invoiceNumber || undefined,
    transactionStatus: transactionStatus || undefined,
    amount,
  };
}

async function updateOrderByInvoiceNumber(invoiceNumber: string, updates: OrderUpdates): Promise<boolean> {
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

      if (parsed.authorizeNetInvoiceNumber !== invoiceNumber) {
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

export const runtime = "nodejs";

export async function POST(request: Request) {
  const apiLoginId = process.env.AUTHORIZE_NET_API_LOGIN_ID;
  const transactionKey = process.env.AUTHORIZE_NET_TRANSACTION_KEY;
  const signatureKey = process.env.AUTHORIZE_NET_WEBHOOK_SIGNATURE_KEY;
  const expectedWebhookId = parseString(process.env.AUTHORIZE_NET_WEBHOOK_ID);
  const environment = (process.env.AUTHORIZE_NET_ENVIRONMENT ?? "sandbox").toLowerCase();

  if (!apiLoginId || !transactionKey || !signatureKey) {
    return NextResponse.json(
      {
        message:
          "Authorize.Net webhook is not fully configured. Add AUTHORIZE_NET_API_LOGIN_ID, AUTHORIZE_NET_TRANSACTION_KEY, and AUTHORIZE_NET_WEBHOOK_SIGNATURE_KEY.",
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

  const rawBody = await request.text();

  if (!verifyWebhookSignature(rawBody, request.headers.get("x-anet-signature"), signatureKey)) {
    return NextResponse.json({ message: "Invalid Authorize.Net signature." }, { status: 401 });
  }

  let body: AuthorizeWebhookPayload;

  try {
    body = JSON.parse(rawBody) as AuthorizeWebhookPayload;
  } catch {
    return NextResponse.json({ message: "Invalid webhook JSON payload." }, { status: 400 });
  }

  const eventType = parseString(body.eventType);
  const transactionId = parseString(body.payload?.id);
  const webhookId = parseString(body.webhookId);

  if (expectedWebhookId && webhookId && expectedWebhookId !== webhookId) {
    return NextResponse.json({ received: true, ignored: true, reason: "webhook_id_mismatch" });
  }

  if (!eventType || !transactionId) {
    return NextResponse.json({ received: true, ignored: true, reason: "missing_event_or_transaction" });
  }

  try {
    const details = await fetchTransactionDetails({
      environment,
      apiLoginId,
      transactionKey,
      transactionId,
    });

    if (!details.invoiceNumber) {
      return NextResponse.json({ received: true, ignored: true, reason: "missing_invoice_number" });
    }

    const status = getStatusFromEventType(eventType, body.payload?.responseCode);
    const amount = details.amount ?? parseNumericAmount(body.payload?.authAmount);

    const updates: OrderUpdates = {
      authorizeNetPaymentStatus: status,
      authorizeNetLastEventType: eventType,
      authorizeNetTransactionId: transactionId,
      authorizeNetTransactionStatus: details.transactionStatus,
      authorizeNetAmount: amount,
      ...(status === "paid" ? { authorizeNetPaidAt: new Date().toISOString() } : {}),
    };

    const updated = await updateOrderByInvoiceNumber(details.invoiceNumber, updates);

    return NextResponse.json({
      received: true,
      updated,
      invoiceNumber: details.invoiceNumber,
      transactionId,
    });
  } catch (error) {
    console.error("Failed to handle Authorize.Net webhook", error);
    return NextResponse.json({ message: "Webhook handler failed." }, { status: 500 });
  }
}