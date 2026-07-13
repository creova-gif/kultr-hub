/**
 * Integration tests for PATCH /users/me/consent — the Phase 2 compliance
 * consent record (GDPR / Quebec Law 25 opt-in bar; see the global-expansion
 * roadmap doc). Requires a real Postgres; skips gracefully if none is
 * reachable.
 */
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { eq, sql } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";

let dbAvailable = false;
let server: import("node:http").Server;
let baseUrl: string;
let userId: string;
let token: string;

before(async () => {
  try {
    await db.execute(sql`select 1`);
    dbAvailable = true;
  } catch (err) {
    console.log(`\n[users.integration.test] Skipping — no reachable database (${(err as Error).message}).\n`);
    return;
  }

  const { default: app } = await import("../../app.js");
  server = app.listen(0);
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;
  baseUrl = `http://127.0.0.1:${port}`;

  const [user] = await db.insert(usersTable).values({
    email: `consent-user-${Date.now()}@example.com`,
    displayName: "Consent Tester",
  }).returning();
  userId = user.id;

  const { signToken } = await import("../../lib/jwt.js");
  token = signToken({ userId: user.id, email: user.email, tokenVersion: user.tokenVersion });
});

after(async () => {
  if (!dbAvailable) return;
  server?.close();
  await db.delete(usersTable).where(eq(usersTable.id, userId));
});

function authHeaders(t: string) {
  return { Authorization: `Bearer ${t}`, "Content-Type": "application/json" };
}

test("GET /auth/me reports trackingConsent as null before any consent choice is made", async (t) => {
  if (!dbAvailable) return t.skip("no reachable database");
  const res = await fetch(`${baseUrl}/api/auth/me`, { headers: authHeaders(token) });
  assert.equal(res.status, 200);
  const body = await res.json() as { trackingConsent: boolean | null; marketingSmsConsent: boolean };
  assert.equal(body.trackingConsent, null);
  assert.equal(body.marketingSmsConsent, false);
});

test("PATCH /users/me/consent records an explicit tracking consent choice and timestamps it", async (t) => {
  if (!dbAvailable) return t.skip("no reachable database");
  const res = await fetch(`${baseUrl}/api/users/me/consent`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ trackingConsent: true }),
  });
  assert.equal(res.status, 200);
  const body = await res.json() as {
    trackingConsent: boolean;
    trackingConsentAt: string;
    marketingSmsConsent: boolean;
    marketingSmsConsentAt: string | null;
  };
  assert.equal(body.trackingConsent, true);
  assert.ok(body.trackingConsentAt);
  // Untouched field stays at its prior value, not silently flipped.
  assert.equal(body.marketingSmsConsent, false);
  assert.equal(body.marketingSmsConsentAt, null);
});

test("PATCH /users/me/consent records marketingSmsConsent independently of trackingConsent", async (t) => {
  if (!dbAvailable) return t.skip("no reachable database");
  const res = await fetch(`${baseUrl}/api/users/me/consent`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ marketingSmsConsent: true }),
  });
  assert.equal(res.status, 200);
  const body = await res.json() as { trackingConsent: boolean; marketingSmsConsent: boolean; marketingSmsConsentAt: string };
  assert.equal(body.marketingSmsConsent, true);
  assert.ok(body.marketingSmsConsentAt);
  // The tracking choice from the previous test is untouched by this call.
  assert.equal(body.trackingConsent, true);
});

test("PATCH /users/me/consent rejects an empty body", async (t) => {
  if (!dbAvailable) return t.skip("no reachable database");
  const res = await fetch(`${baseUrl}/api/users/me/consent`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({}),
  });
  assert.equal(res.status, 400);
});

test("PATCH /users/me/consent rejects a non-boolean value", async (t) => {
  if (!dbAvailable) return t.skip("no reachable database");
  const res = await fetch(`${baseUrl}/api/users/me/consent`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ trackingConsent: "yes" }),
  });
  assert.equal(res.status, 400);
});

test("PATCH /users/me/consent requires authentication", async (t) => {
  if (!dbAvailable) return t.skip("no reachable database");
  const res = await fetch(`${baseUrl}/api/users/me/consent`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ trackingConsent: true }),
  });
  assert.equal(res.status, 401);
});
