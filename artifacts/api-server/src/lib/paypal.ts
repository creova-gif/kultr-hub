/**
 * PayPal Checkout integration — a second diaspora card/wallet option
 * alongside Stripe (lib/stripe.ts). Uses the PayPal Orders API v2 (REST,
 * OAuth2 client-credentials flow), the same rail Stripe covers for markets
 * PayPal reaches but a user may simply prefer or already have an account
 * with.
 *
 * Follows the same simulated-fallback contract as every other provider in
 * this codebase: with no credentials configured, every call below returns
 * null without making a network request. A configured-but-rejected call
 * throws instead of returning null, so a live rejection can never be
 * misread as "not configured" and fall through to a simulated success.
 *
 * Env vars (leave unset for simulated mode):
 *   PAYPAL_CLIENT_ID
 *   PAYPAL_CLIENT_SECRET
 *   PAYPAL_ENVIRONMENT — "sandbox" (default) | "production"
 *
 * Docs: https://developer.paypal.com/docs/api/orders/v2/
 */

const CLIENT_ID = process.env.PAYPAL_CLIENT_ID ?? "";
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET ?? "";
const ENVIRONMENT = process.env.PAYPAL_ENVIRONMENT ?? "sandbox";

const BASE_URL =
  ENVIRONMENT === "production" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

export function isPayPalConfigured(): boolean {
  return Boolean(CLIENT_ID && CLIENT_SECRET);
}

async function getAccessToken(): Promise<string> {
  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  const res = await fetch(`${BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error(`PayPal OAuth error ${res.status}: ${await res.text().catch(() => "")}`);
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

async function paypalFetch<T>(path: string, token: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`PayPal API error ${res.status}: ${body}`);
  }
  return (await res.json()) as T;
}

interface PayPalOrderCreateResponse {
  id: string;
  links: Array<{ rel: string; href: string }>;
}

export interface CreateOrderParams {
  /** Unit price in the smallest unit of `currency` (e.g. cents). */
  unitAmountMinor: number;
  quantity: number;
  /** ISO 4217 currency code, e.g. "USD", "GBP". */
  currency: string;
  description: string;
  /** Our own payment reference — round-trips via custom_id for support/debugging. */
  reference: string;
  returnUrl: string;
  cancelUrl: string;
}

/**
 * Create a PayPal order (intent CAPTURE). Returns null only in simulated
 * mode (no credentials configured) — a configured-but-rejected request throws.
 */
export async function createOrder(
  params: CreateOrderParams,
): Promise<{ orderId: string; approveUrl: string } | null> {
  if (!isPayPalConfigured()) return null;

  const token = await getAccessToken();
  const totalMinor = params.unitAmountMinor * params.quantity;
  const value = (totalMinor / 100).toFixed(2);

  const order = await paypalFetch<PayPalOrderCreateResponse>("/v2/checkout/orders", token, {
    method: "POST",
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          custom_id: params.reference,
          description: params.description,
          amount: { currency_code: params.currency.toUpperCase(), value },
        },
      ],
      application_context: {
        return_url: params.returnUrl,
        cancel_url: params.cancelUrl,
        user_action: "PAY_NOW",
      },
    }),
  });

  const approveLink = order.links.find((l) => l.rel === "approve")?.href;
  if (!approveLink) throw new Error("PayPal order created without an approve link");
  return { orderId: order.id, approveUrl: approveLink };
}

interface PayPalCaptureResponse {
  status: string;
  purchase_units: Array<{
    payments?: {
      captures?: Array<{ status: string; amount: { currency_code: string; value: string } }>;
    };
  }>;
}

export interface CaptureOrderResult {
  success: boolean;
  amountTotalMinor: number;
  currency: string;
}

/**
 * Capture a previously-approved order. Returns null only in simulated mode.
 */
export async function captureOrder(orderId: string): Promise<CaptureOrderResult | null> {
  if (!isPayPalConfigured()) return null;

  const token = await getAccessToken();
  const result = await paypalFetch<PayPalCaptureResponse>(`/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, token, {
    method: "POST",
  });

  const capture = result.purchase_units[0]?.payments?.captures?.[0];
  if (!capture) {
    return { success: false, amountTotalMinor: 0, currency: "" };
  }

  return {
    success: result.status === "COMPLETED" && capture.status === "COMPLETED",
    amountTotalMinor: Math.round(Number(capture.amount.value) * 100),
    currency: capture.amount.currency_code,
  };
}
