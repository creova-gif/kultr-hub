import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { sql } from "drizzle-orm";
import {
  db,
  usersTable,
  eventsTable,
  beverageProductsTable,
  eventBeverageBundlesTable,
  beverageVouchersTable,
} from "@workspace/db";
import { signToken } from "../../lib/jwt.js";

let dbAvailable = false;
let server: import("node:http").Server;
let baseUrl: string;
let bartenderId: string;
let bartenderToken: string;
let eventId: string;
let bundleId: string;
let activeVoucherCode: string;

before(async () => {
  try {
    await db.execute(sql`select 1`);
    dbAvailable = true;
  } catch (err) {
    console.log(
      `\n[beverages.integration.test] Skipping — no reachable database (${(err as Error).message}).\n`,
    );
    return;
  }

  const { default: app } = await import("../../app.js");
  server = app.listen(0);
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;
  baseUrl = `http://127.0.0.1:${port}`;

  // 1. Create bartender user
  const [user] = await db
    .insert(usersTable)
    .values({
      email: `bartender-${Date.now()}@example.com`,
      displayName: "Venue Bartender",
      isCreator: true,
      countryCode: "KE",
    })
    .returning();
  bartenderId = user.id;
  bartenderToken = signToken({ userId: user.id, email: user.email, tokenVersion: user.tokenVersion });

  // 2. Create test event
  const [event] = await db
    .insert(eventsTable)
    .values({
      creatorId: bartenderId,
      title: "Kultr Sunset Festival",
      subtitle: "Electronic Beats & Botanical Sips",
      description: "Music and drinks in Nairobi",
      category: "Music",
      venue: "Alchemist Bar",
      city: "Nairobi",
      country: "Kenya",
      countryCode: "KE",
      eventDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      imageKey: "concert",
      capacity: 500,
      status: "live",
    })
    .returning();
  eventId = event.id;

  // 3. Create test beverage product
  const [product] = await db
    .insert(beverageProductsTable)
    .values({
      name: "Kultr Zobo Tonic",
      flavor: "Hibiscus & Ginger",
      sku: `KTR-TEST-${Date.now()}`,
      volumeMl: 330,
      description: "Organic hibiscus test drink",
      basePrice: "250.00",
      currency: "KES",
      isActive: true,
    })
    .returning();

  // 4. Create event bundle
  const [bundle] = await db
    .insert(eventBeverageBundlesTable)
    .values({
      eventId,
      beverageProductId: product.id,
      title: "Zobo 4-Pack Test Bundle",
      quantityUnits: 4,
      bundlePrice: "800.00",
      currency: "KES",
      allocatedInventory: 100,
      claimedInventory: 1,
      isActive: true,
    })
    .returning();
  bundleId = bundle.id;

  // 5. Create test voucher
  activeVoucherCode = `KTR-BAR-TEST-${Date.now().toString(36).toUpperCase()}`;
  await db
    .insert(beverageVouchersTable)
    .values({
      voucherCode: activeVoucherCode,
      userId: bartenderId,
      eventId,
      bundleId,
      totalUnits: 4,
      redeemedUnits: 0,
      status: "active",
      signatureHash: "test_sig_hash",
      paymentReference: `ref_test_${Date.now()}`,
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
    });
});

after(async () => {
  if (server) {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

test("GET /api/beverages returns catalog products", async (t) => {
  if (!dbAvailable) return t.skip();

  const res = await fetch(`${baseUrl}/api/beverages`);
  assert.equal(res.status, 200);
  const data = await res.json() as { products: Array<{ name: string; sku: string }> };
  assert.ok(Array.isArray(data.products));
  assert.ok(data.products.length > 0);
});

test("GET /api/beverages/events/:eventId/bundles returns event bundles", async (t) => {
  if (!dbAvailable) return t.skip();

  const res = await fetch(`${baseUrl}/api/beverages/events/${eventId}/bundles`);
  assert.equal(res.status, 200);
  const data = await res.json() as { bundles: Array<{ id: string; title: string }> };
  assert.ok(Array.isArray(data.bundles));
  assert.ok(data.bundles.some((b) => b.id === bundleId));
});

test("POST /api/beverages/redeem rejects unauthenticated request", async (t) => {
  if (!dbAvailable) return t.skip();

  const res = await fetch(`${baseUrl}/api/beverages/redeem`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ voucherCode: activeVoucherCode }),
  });
  assert.equal(res.status, 401);
});

test("POST /api/beverages/redeem rejects non-existent voucher code", async (t) => {
  if (!dbAvailable) return t.skip();

  const res = await fetch(`${baseUrl}/api/beverages/redeem`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bartenderToken}`,
    },
    body: JSON.stringify({ voucherCode: "KTR-BAR-INVALID-CODE" }),
  });
  assert.equal(res.status, 400);
});

test("POST /api/beverages/redeem successfully redeems 1 unit", async (t) => {
  if (!dbAvailable) return t.skip();

  const idempotencyKey = `idem-test-1-${Date.now()}`;
  const res = await fetch(`${baseUrl}/api/beverages/redeem`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bartenderToken}`,
    },
    body: JSON.stringify({
      voucherCode: activeVoucherCode,
      stationIdentifier: "TEST_BAR_STATION",
      units: 1,
      idempotencyKey,
    }),
  });

  assert.equal(res.status, 200);
  const data = await res.json() as {
    success: boolean;
    remainingUnits: number;
    redeemedUnits: number;
    alreadyRedeemed?: boolean;
  };

  assert.equal(data.success, true);
  assert.equal(data.redeemedUnits, 1);
  assert.equal(data.remainingUnits, 3);
  assert.equal(data.alreadyRedeemed, undefined);
});

test("POST /api/beverages/redeem is idempotent when replaying same key", async (t) => {
  if (!dbAvailable) return t.skip();

  const idempotencyKey = `idem-test-replay-${Date.now()}`;

  // First request
  const res1 = await fetch(`${baseUrl}/api/beverages/redeem`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bartenderToken}`,
    },
    body: JSON.stringify({
      voucherCode: activeVoucherCode,
      stationIdentifier: "TEST_BAR_STATION",
      units: 1,
      idempotencyKey,
    }),
  });
  assert.equal(res1.status, 200);

  // Replayed request with identical idempotencyKey
  const res2 = await fetch(`${baseUrl}/api/beverages/redeem`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bartenderToken}`,
    },
    body: JSON.stringify({
      voucherCode: activeVoucherCode,
      stationIdentifier: "TEST_BAR_STATION",
      units: 1,
      idempotencyKey,
    }),
  });
  assert.equal(res2.status, 200);
  const data2 = await res2.json() as { alreadyRedeemed: boolean };
  assert.equal(data2.alreadyRedeemed, true);
});
