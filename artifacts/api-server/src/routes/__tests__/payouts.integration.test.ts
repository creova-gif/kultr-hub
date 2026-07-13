/**
 * Integration test for the payout race conditions closed this pass:
 *   1. POST /payouts used to compute "available balance" and insert outside
 *      any transaction/lock, so two concurrent requests could both read the
 *      same balance and both get created, together exceeding it.
 *   2. PATCH /payouts/:id used a separate read-then-write, so two concurrent
 *      resolutions (two admins, or a double-click) could both succeed and
 *      silently overwrite each other's result.
 * Each test uses its own freshly-created creator so balances start at zero
 * and one test's revenue can never leak into another's assertions.
 * Requires a real Postgres (same DATABASE_URL convention as the other
 * integration tests); skips gracefully if none is reachable.
 */
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { eq, sql } from "drizzle-orm";
import { db, usersTable, eventsTable, ticketTypesTable, ticketsTable, payoutsTable } from "@workspace/db";

let dbAvailable = false;
let server: import("node:http").Server;
let baseUrl: string;
let adminId: string;
let adminToken: string;
const createdUserIds: string[] = [];

async function makeCreatorWithRevenue(amountKes: number): Promise<{ id: string; token: string }> {
  const { signToken } = await import("../../lib/jwt.js");
  const [creator] = await db.insert(usersTable).values({
    email: `payout-creator-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`,
    displayName: "Payout Creator",
  }).returning();
  createdUserIds.push(creator.id);
  const token = signToken({ userId: creator.id, email: creator.email, tokenVersion: creator.tokenVersion });

  const [event] = await db.insert(eventsTable).values({
    creatorId: creator.id,
    title: "Payout Test Event",
    description: "test",
    category: "Music",
    venue: "Test Venue",
    city: "Nairobi",
    country: "Kenya",
    countryCode: "KE",
    eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: "live",
  }).returning();
  const [ticketType] = await db.insert(ticketTypesTable).values({
    eventId: event.id,
    name: "General",
    price: String(amountKes),
    currency: "KES",
    totalQuantity: 10,
  }).returning();
  await db.insert(ticketsTable).values({
    ticketNumber: `PAYOUT-TEST-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    userId: creator.id,
    eventId: event.id,
    ticketTypeId: ticketType.id,
    unitPrice: String(amountKes),
    totalAmount: String(amountKes),
    currency: "KES",
    status: "confirmed",
  });

  return { id: creator.id, token };
}

before(async () => {
  try {
    await db.execute(sql`select 1`);
    dbAvailable = true;
  } catch (err) {
    console.log(`\n[payouts.integration.test] Skipping — no reachable database (${(err as Error).message}).\n`);
    return;
  }

  const { default: app } = await import("../../app.js");
  server = app.listen(0);
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;
  baseUrl = `http://127.0.0.1:${port}`;

  const [admin] = await db.insert(usersTable).values({
    email: `payout-admin-${Date.now()}@example.com`,
    displayName: "Payout Admin",
    isAdmin: true,
  }).returning();
  adminId = admin.id;

  const { signToken } = await import("../../lib/jwt.js");
  adminToken = signToken({ userId: adminId, email: admin.email, tokenVersion: admin.tokenVersion });
});

after(async () => {
  if (!dbAvailable) return;
  server?.close();
  for (const userId of createdUserIds) {
    await db.delete(payoutsTable).where(eq(payoutsTable.creatorId, userId));
    await db.delete(eventsTable).where(eq(eventsTable.creatorId, userId));
    await db.delete(usersTable).where(eq(usersTable.id, userId));
  }
  await db.delete(usersTable).where(eq(usersTable.id, adminId));
});

test("a payout request exceeding available balance is rejected", async (t) => {
  if (!dbAvailable) return t.skip("no reachable database");
  const creator = await makeCreatorWithRevenue(1000);

  const res = await fetch(`${baseUrl}/api/payouts`, {
    method: "POST",
    headers: { Authorization: `Bearer ${creator.token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ amount: 999999, currency: "KES", destination: "0712345678" }),
  });
  assert.equal(res.status, 400);
});

test("two concurrent payout requests that together exceed the balance cannot both succeed", async (t) => {
  if (!dbAvailable) return t.skip("no reachable database");
  const creator = await makeCreatorWithRevenue(1000); // exactly enough for one 1000 request, not two

  const fire = () =>
    fetch(`${baseUrl}/api/payouts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${creator.token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 1000, currency: "KES", destination: "0712345678" }),
    });

  const [a, b] = await Promise.all([fire(), fire()]);
  const statuses = [a.status, b.status].sort();
  assert.deepEqual(statuses, [201, 400], "exactly one of the two concurrent requests must succeed");
});

test("a payout cannot be resolved twice, even by two concurrent admin actions", async (t) => {
  if (!dbAvailable) return t.skip("no reachable database");
  const creator = await makeCreatorWithRevenue(500);

  const create = await fetch(`${baseUrl}/api/payouts`, {
    method: "POST",
    headers: { Authorization: `Bearer ${creator.token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ amount: 500, currency: "KES", destination: "0712345678" }),
  });
  assert.equal(create.status, 201);
  const { id } = await create.json() as { id: string };

  const resolve = () =>
    fetch(`${baseUrl}/api/payouts/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${adminToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ status: "paid" }),
    });

  const [a, b] = await Promise.all([resolve(), resolve()]);
  const statuses = [a.status, b.status].sort();
  assert.deepEqual(statuses, [200, 409], "exactly one of the two concurrent resolutions must succeed");

  const [row] = await db.select().from(payoutsTable).where(eq(payoutsTable.id, id)).limit(1);
  assert.equal(row.status, "paid");
});
