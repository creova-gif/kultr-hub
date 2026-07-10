import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { simulationAllowed } from "../simulation.js";

// simulationAllowed reads process.env.NODE_ENV directly (by design — this is
// the server-side authority the client-controlled `simulated` flag bypass was
// replaced with). Save/restore around each assertion so this suite doesn't
// leak env state to other test files.
let originalNodeEnv: string | undefined;
before(() => { originalNodeEnv = process.env.NODE_ENV; });
after(() => { process.env.NODE_ENV = originalNodeEnv; });

test("simulation: never allowed in production, even with no provider configured", () => {
  process.env.NODE_ENV = "production";
  assert.equal(simulationAllowed(false), false);
  assert.equal(simulationAllowed(true), false);
});

test("simulation: allowed outside production only when the provider is NOT configured", () => {
  process.env.NODE_ENV = "development";
  assert.equal(simulationAllowed(false), true);
  assert.equal(simulationAllowed(true), false);
});

test("simulation: allowed in an unset NODE_ENV (treated as non-production) when unconfigured", () => {
  process.env.NODE_ENV = "";
  assert.equal(simulationAllowed(false), true);
});
