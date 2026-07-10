/**
 * Integration tests for issueTicket() against a REAL Postgres database — the
 * idempotency and oversell guarantees this audit fixed are enforced by actual
 * DB behavior (a UNIQUE constraint, a guarded conditional UPDATE), so a mock
 * of the query builder would not actually prove either guarantee holds.
 *
 * Requires DATABASE_URL to point at a database with migrations applied
 * (`pnpm --filter @workspace/db run migrate`). Skips gracefully — printing
 * why — if no database is reachable, so `node --test` doesn't hard-fail on a
 * machine without one. CI provisions a real Postgres service container for
 * this file; see .github/workflows/ci.yml.
 */
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { eq, sql } from "drizzle-orm";
import { db, usersTable, eventsTable, ticketTypesTable, ticketsTable } from "@workspace/db";
import { issueTicket, TicketIssueError } from "../issue.js";

let dbAvailable = false;
let userId: string;
let eventId: string;

before(async () => {
  try {
    await db.execute(sql`select 1`);
    dbAvailable = true;
  } catch (err) {
    console.log(`\n[issue.integration.test] Skipping — no reachable database (${(err as Error).message}).\n`);
    return;
  }

  const [user] = await db
    .insert(usersTable)
    .values({ email: `issue-test-${Date.now()}@example.com`, displayName: "Issue Test User" })
    .returning();
  userId = user.id;

  const [event] = await db
    .insert(eventsTable)
    .values({
      creatorId: userId,
      title: "Issue Test Event",
      description: "fixture",
      category: "Music",
      venue: "Test Venue",
      city: "Nairobi",
      country: "Kenya",
      countryCode: "KE",
      eventDate: new Date(Date.now() + 86_400_000),
    })
    .returning();
  eventId = event.id;
});

after(async () => {
  if (!dbAvailable) return;
  await db.delete(eventsTable).where(eq(eventsTable.id, eventId));
  await db.delete(usersTable).where(eq(usersTable.id, userId));
});

async function makeTicketType(totalQuantity: number) {
  const [tt] = await db
    .insert(ticketTypesTable)
    .values({ eventId, name: "GA", price: "1000", currency: "KES", totalQuantity })
    .returning();
  return tt;
}

test("issueTicket: idempotency — replaying the same paymentReference issues exactly one ticket", async (t) => {
  if (!dbAvailable) return t.skip("no reachable database");
  const tt = await makeTicketType(10);
  const paymentReference = `test-idem-${Date.now()}`;

  const first = await issueTicket({
    userId, eventId, ticketTypeId: tt.id, quantity: 1, unitPrice: 1000,
    currency: "KES", paymentReference, paymentProvider: "test",
  });
  assert.equal(first.deduped, false);

  // Simulate a replay — same payment reference verified twice (double-fire
  // callback, retried request, user double-tapping "confirm").
  const second = await issueTicket({
    userId, eventId, ticketTypeId: tt.id, quantity: 1, unitPrice: 1000,
    currency: "KES", paymentReference, paymentProvider: "test",
  });
  assert.equal(second.deduped, true);
  assert.equal(second.ticket.id, first.ticket.id, "replay must return the SAME ticket, not a new one");

  const rows = await db.select().from(ticketsTable).where(eq(ticketsTable.paymentReference, paymentReference));
  assert.equal(rows.length, 1, "exactly one ticket row must exist for this payment reference");

  const [refreshedType] = await db.select().from(ticketTypesTable).where(eq(ticketTypesTable.id, tt.id));
  assert.equal(refreshedType.soldQuantity, 1, "inventory must only be decremented once, not once per replay");
});

test("issueTicket: oversell guard — concurrent issuance never exceeds total inventory", async (t) => {
  if (!dbAvailable) return t.skip("no reachable database");
  const tt = await makeTicketType(1); // exactly one ticket available

  const attempts = await Promise.allSettled([
    issueTicket({ userId, eventId, ticketTypeId: tt.id, quantity: 1, unitPrice: 1000, currency: "KES", paymentReference: `test-oversell-a-${Date.now()}`, paymentProvider: "test" }),
    issueTicket({ userId, eventId, ticketTypeId: tt.id, quantity: 1, unitPrice: 1000, currency: "KES", paymentReference: `test-oversell-b-${Date.now()}`, paymentProvider: "test" }),
  ]);

  const fulfilled = attempts.filter((a) => a.status === "fulfilled");
  const rejected = attempts.filter((a) => a.status === "rejected");

  assert.equal(fulfilled.length, 1, "exactly one concurrent purchase should succeed for 1 unit of inventory");
  assert.equal(rejected.length, 1, "the losing purchase should be rejected, not silently oversold");
  assert.ok(
    rejected[0].status === "rejected" && rejected[0].reason instanceof TicketIssueError && rejected[0].reason.code === "sold_out",
    "the rejection must be a sold_out TicketIssueError",
  );

  const [refreshedType] = await db.select().from(ticketTypesTable).where(eq(ticketTypesTable.id, tt.id));
  assert.equal(refreshedType.soldQuantity, 1, "soldQuantity must never exceed totalQuantity, even under a concurrent race");
});

test("issueTicket: two different payment references for the same ticket type each get their own ticket", async (t) => {
  if (!dbAvailable) return t.skip("no reachable database");
  const tt = await makeTicketType(10);

  const a = await issueTicket({ userId, eventId, ticketTypeId: tt.id, quantity: 2, unitPrice: 1000, currency: "KES", paymentReference: `test-distinct-a-${Date.now()}`, paymentProvider: "test" });
  const b = await issueTicket({ userId, eventId, ticketTypeId: tt.id, quantity: 3, unitPrice: 1000, currency: "KES", paymentReference: `test-distinct-b-${Date.now()}`, paymentProvider: "test" });

  assert.notEqual(a.ticket.id, b.ticket.id);
  const [refreshedType] = await db.select().from(ticketTypesTable).where(eq(ticketTypesTable.id, tt.id));
  assert.equal(refreshedType.soldQuantity, 5, "2 + 3 units across two distinct payments");
});
