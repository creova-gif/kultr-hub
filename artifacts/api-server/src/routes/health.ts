import { Router, type IRouter } from "express";
import { sql } from "drizzle-orm";
import { db } from "@workspace/db";
import { HealthCheckResponse } from "@workspace/api-zod";

const router: IRouter = Router();

// A real readiness probe, not a static 200 — deploy smoke tests and load
// balancers should be able to tell a healthy instance from one whose DB
// connection is down.
router.get("/healthz", async (_req, res) => {
  try {
    await db.execute(sql`select 1`);
  } catch {
    res.status(503).json({ status: "error", detail: "database unreachable" });
    return;
  }
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});

export default router;
