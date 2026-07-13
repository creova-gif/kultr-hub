import { Router } from "express";
import { eq, desc } from "drizzle-orm";
import { db, eventsTable, eventReportsTable } from "@workspace/db";
import { requireAuth, requireAdmin, type AuthedRequest } from "../middleware/auth.js";
import { validateUuidParam } from "../middleware/validateUuidParam.js";
import type { Request, Response } from "express";

/**
 * Buyer-submitted fraud/abuse reports on an event. Filing a report is purely
 * additive — it never changes the event's own status. An admin reviews the
 * queue (GET /events/admin/reports) and marks each report reviewed or
 * dismissed (PATCH /events/admin/reports/:id); if a report is credible the
 * admin acts on the event separately via PATCH /events/:id/status.
 */

const router = Router();
router.param("id", validateUuidParam);

const REPORT_REASONS = [
  "misleading_listing",
  "suspected_scam",
  "inappropriate_content",
  "duplicate_event",
  "other",
] as const;

router.post("/:id/report", requireAuth, async (req: Request, res: Response) => {
  const authed = req as AuthedRequest;
  const eventId = String(req.params.id);
  const { reason, details } = req.body as { reason?: string; details?: string };

  if (!reason || !REPORT_REASONS.includes(reason as (typeof REPORT_REASONS)[number])) {
    res.status(400).json({ message: `reason must be one of: ${REPORT_REASONS.join(", ")}` });
    return;
  }

  const [event] = await db.select({ id: eventsTable.id }).from(eventsTable).where(eq(eventsTable.id, eventId)).limit(1);
  if (!event) {
    res.status(404).json({ message: "Event not found" });
    return;
  }

  const [report] = await db
    .insert(eventReportsTable)
    .values({
      eventId,
      reporterId: authed.userId,
      reason,
      details: details?.trim() || undefined,
    })
    .returning();

  res.status(201).json({
    id: report.id,
    eventId: report.eventId,
    reason: report.reason,
    details: report.details,
    status: report.status,
    createdAt: report.createdAt.toISOString(),
  });
});

/**
 * GET /api/events/admin/reports — every report, newest first (admin only).
 * Registered under the events router so URLs stay under /events/admin/*,
 * mirroring /events/admin/all.
 */
router.get("/admin/reports", requireAuth, requireAdmin, async (req: Request, res: Response) => {
  const reports = await db.select().from(eventReportsTable).orderBy(desc(eventReportsTable.createdAt));

  res.json({
    reports: reports.map((r) => ({
      id: r.id,
      eventId: r.eventId,
      reporterId: r.reporterId,
      reason: r.reason,
      details: r.details,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
      resolvedAt: r.resolvedAt?.toISOString() ?? null,
    })),
  });
});

const REPORT_RESOLUTION_STATUSES = ["reviewed", "dismissed"] as const;

router.patch("/admin/reports/:id", requireAuth, requireAdmin, async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const { status } = req.body as { status?: string };

  if (!status || !REPORT_RESOLUTION_STATUSES.includes(status as (typeof REPORT_RESOLUTION_STATUSES)[number])) {
    res.status(400).json({ message: `status must be one of: ${REPORT_RESOLUTION_STATUSES.join(", ")}` });
    return;
  }

  const [report] = await db.select().from(eventReportsTable).where(eq(eventReportsTable.id, id)).limit(1);
  if (!report) { res.status(404).json({ message: "Report not found" }); return; }

  const [updated] = await db
    .update(eventReportsTable)
    .set({ status: status as (typeof REPORT_RESOLUTION_STATUSES)[number], resolvedAt: new Date() })
    .where(eq(eventReportsTable.id, id))
    .returning();

  res.json({ id: updated.id, status: updated.status, resolvedAt: updated.resolvedAt?.toISOString() ?? null });
});

export { REPORT_REASONS };
export default router;
