/**
 * Integration tests for POPIA §26 special-category data: dietary/
 * accessibility submissions on a ticket, and the creator-facing attendee
 * needs view. Requires a real Postgres and SPECIAL_CATEGORY_ENCRYPTION_KEY
 * to be set; skips gracefully if either is missing.
 */
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { eq, sql } from "drizzle-orm";
import { db, usersTable, eventsTable, ticketTypesTable, ticketsTable } from "@workspace/db";
import { isSpecialCategoryEncryptionConfigured } from "../../lib/specialCategoryEncryption.js";

let dbAvailable = false;
let server: import("node:http").Server;
let baseUrl: string;
let buyerId: string;
let buyerToken: string;
let otherBuyerId: string;
let otherBuyerToken: string;
let creatorId: string;
let creatorToken: string;
let eventId: string;
let ticketId: string;

before(async () => {
  try {
    await db.execute(sql`select 1`);
    dbAvailable = true;
  } catch (err) {
    console.log(`\n[accessibility-info.integration.test] Skipping — no reachable database (${(err as Error).message}).\n`);
    return;
  }

  const { default: app } = await import("../../app.js");
  server = app.listen(0);
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;
  baseUrl = `http://127.0.0.1:${port}`;

  const [creator] = await db.insert(usersTable).values({
    email: `accessibility-creator-${Date.now()}@example.com`,
    displayName: "Event Creator",
  }).returning();
  creatorId = creator.id;

  const [buyer] = await db.insert(usersTable).values({
    email: `accessibility-buyer-${Date.now()}@example.com`,
    displayName: "Ticket Buyer",
  }).returning();
  buyerId = buyer.id;

  const [otherBuyer] = await db.insert(usersTable).values({
    email: `accessibility-other-${Date.now()}@example.com`,
    displayName: "Someone Else",
  }).returning();
  otherBuyerId = otherBuyer.id;

  const [event] = await db.insert(eventsTable).values({
    creatorId,
    title: "Accessibility Test Event",
    description: "test",
    category: "Music",
    venue: "Test Venue",
    city: "Nairobi",
    country: "Kenya",
    countryCode: "KE",
    eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: "live",
  }).returning();
  eventId = event.id;

  const [ticketType] = await db.insert(ticketTypesTable).values({
    eventId,
    name: "General",
    price: "0",
    currency: "KES",
    totalQuantity: 100,
  }).returning();

  const [ticket] = await db.insert(ticketsTable).values({
    ticketNumber: `KTR-TEST-${Date.now()}`,
    userId: buyerId,
    eventId,
    ticketTypeId: ticketType.id,
    quantity: 1,
    unitPrice: "0",
    totalAmount: "0",
    currency: "KES",
    paymentReference: `free_test_${Date.now()}`,
    paymentProvider: "free",
  }).returning();
  ticketId = ticket.id;

  const { signToken } = await import("../../lib/jwt.js");
  buyerToken = signToken({ userId: buyerId, email: buyer.email, tokenVersion: buyer.tokenVersion });
  otherBuyerToken = signToken({ userId: otherBuyerId, email: otherBuyer.email, tokenVersion: otherBuyer.tokenVersion });
  creatorToken = signToken({ userId: creatorId, email: creator.email, tokenVersion: creator.tokenVersion });
});

after(async () => {
  if (!dbAvailable) return;
  server?.close();
  await db.delete(ticketsTable).where(eq(ticketsTable.eventId, eventId));
  await db.delete(eventsTable).where(eq(eventsTable.id, eventId));
  await db.delete(usersTable).where(eq(usersTable.id, buyerId));
  await db.delete(usersTable).where(eq(usersTable.id, otherBuyerId));
  await db.delete(usersTable).where(eq(usersTable.id, creatorId));
});

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

test("PATCH /tickets/:id/accessibility-info requires a real ticket owned by the caller", async (t) => {
  if (!dbAvailable) return t.skip("no reachable database");
  const res = await fetch(`${baseUrl}/api/tickets/${ticketId}/accessibility-info`, {
    method: "PATCH",
    headers: authHeaders(otherBuyerToken),
    body: JSON.stringify({ info: "Vegetarian" }),
  });
  assert.equal(res.status, 404);
});

test("PATCH /tickets/:id/accessibility-info rejects a missing info field", async (t) => {
  if (!dbAvailable) return t.skip("no reachable database");
  const res = await fetch(`${baseUrl}/api/tickets/${ticketId}/accessibility-info`, {
    method: "PATCH",
    headers: authHeaders(buyerToken),
    body: JSON.stringify({}),
  });
  assert.equal(res.status, 400);
});

test("PATCH /tickets/:id/accessibility-info stores and returns the plaintext to the owner; GET /tickets/:id decrypts it back", async (t) => {
  if (!dbAvailable) return t.skip("no reachable database");
  if (!isSpecialCategoryEncryptionConfigured()) return t.skip("SPECIAL_CATEGORY_ENCRYPTION_KEY not configured");

  const patchRes = await fetch(`${baseUrl}/api/tickets/${ticketId}/accessibility-info`, {
    method: "PATCH",
    headers: authHeaders(buyerToken),
    body: JSON.stringify({ info: "Nut allergy; wheelchair access needed" }),
  });
  assert.equal(patchRes.status, 200);
  const patchBody = await patchRes.json() as { accessibilityInfo: string; accessibilityConsentAt: string };
  assert.equal(patchBody.accessibilityInfo, "Nut allergy; wheelchair access needed");
  assert.ok(patchBody.accessibilityConsentAt);

  // The DB row must never hold this as plaintext.
  const [row] = await db.select().from(ticketsTable).where(eq(ticketsTable.id, ticketId)).limit(1);
  assert.ok(row.accessibilityInfo);
  assert.notEqual(row.accessibilityInfo, "Nut allergy; wheelchair access needed");

  const getRes = await fetch(`${baseUrl}/api/tickets/${ticketId}`, { headers: authHeaders(buyerToken) });
  assert.equal(getRes.status, 200);
  const getBody = await getRes.json() as { accessibilityInfo: string };
  assert.equal(getBody.accessibilityInfo, "Nut allergy; wheelchair access needed");
});

test("PATCH /tickets/:id/accessibility-info withdraws a submission when info is null", async (t) => {
  if (!dbAvailable) return t.skip("no reachable database");
  if (!isSpecialCategoryEncryptionConfigured()) return t.skip("SPECIAL_CATEGORY_ENCRYPTION_KEY not configured");

  await fetch(`${baseUrl}/api/tickets/${ticketId}/accessibility-info`, {
    method: "PATCH",
    headers: authHeaders(buyerToken),
    body: JSON.stringify({ info: "Vegan" }),
  });

  const withdrawRes = await fetch(`${baseUrl}/api/tickets/${ticketId}/accessibility-info`, {
    method: "PATCH",
    headers: authHeaders(buyerToken),
    body: JSON.stringify({ info: null }),
  });
  assert.equal(withdrawRes.status, 200);
  const body = await withdrawRes.json() as { accessibilityInfo: string | null };
  assert.equal(body.accessibilityInfo, null);

  const [row] = await db.select().from(ticketsTable).where(eq(ticketsTable.id, ticketId)).limit(1);
  assert.equal(row.accessibilityInfo, null);
  assert.equal(row.accessibilityConsentAt, null);
});

test("GET /events/:id/attendee-needs is forbidden for a non-creator", async (t) => {
  if (!dbAvailable) return t.skip("no reachable database");
  const res = await fetch(`${baseUrl}/api/events/${eventId}/attendee-needs`, {
    headers: authHeaders(buyerToken),
  });
  assert.equal(res.status, 403);
});

test("GET /events/:id/attendee-needs returns only opted-in attendees, decrypted, to the creator", async (t) => {
  if (!dbAvailable) return t.skip("no reachable database");
  if (!isSpecialCategoryEncryptionConfigured()) return t.skip("SPECIAL_CATEGORY_ENCRYPTION_KEY not configured");

  await fetch(`${baseUrl}/api/tickets/${ticketId}/accessibility-info`, {
    method: "PATCH",
    headers: authHeaders(buyerToken),
    body: JSON.stringify({ info: "Gluten-free" }),
  });

  const res = await fetch(`${baseUrl}/api/events/${eventId}/attendee-needs`, {
    headers: authHeaders(creatorToken),
  });
  assert.equal(res.status, 200);
  const body = await res.json() as { attendeeNeeds: Array<{ ticketId: string; accessibilityInfo: string; buyerName: string }>; total: number };
  assert.equal(body.total, 1);
  assert.equal(body.attendeeNeeds[0].ticketId, ticketId);
  assert.equal(body.attendeeNeeds[0].accessibilityInfo, "Gluten-free");
  assert.equal(body.attendeeNeeds[0].buyerName, "Ticket Buyer");
});
