import { test } from "node:test";
import assert from "node:assert/strict";
import { validateQuantity, MAX_TICKETS_PER_ORDER, TicketIssueError } from "../issue.js";

test("validateQuantity: accepts integers in [1, MAX_TICKETS_PER_ORDER]", () => {
  assert.equal(validateQuantity(1), 1);
  assert.equal(validateQuantity(MAX_TICKETS_PER_ORDER), MAX_TICKETS_PER_ORDER);
  assert.equal(validateQuantity("5"), 5);
});

test("validateQuantity: rejects zero, negative, fractional, and above-max quantities", () => {
  for (const bad of [0, -1, -5, 1.5, MAX_TICKETS_PER_ORDER + 1, 1000]) {
    assert.throws(() => validateQuantity(bad), TicketIssueError, `expected ${bad} to be rejected`);
  }
});

test("validateQuantity: rejects non-numeric, NaN, and missing input", () => {
  for (const bad of ["abc", NaN, undefined, null, {}, []]) {
    assert.throws(() => validateQuantity(bad), TicketIssueError, `expected ${JSON.stringify(bad)} to be rejected`);
  }
});

test("validateQuantity: the thrown error carries the invalid_quantity code, not sold_out", () => {
  try {
    validateQuantity(-5);
    assert.fail("expected validateQuantity to throw");
  } catch (err) {
    assert.ok(err instanceof TicketIssueError);
    assert.equal(err.code, "invalid_quantity");
  }
});
