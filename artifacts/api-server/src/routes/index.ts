import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import eventsRouter from "./events.js";
import ticketsRouter from "./tickets.js";
import paymentsRouter from "./payments.js";
import payoutsRouter from "./payouts.js";
import fxRouter from "./fx.js";
import gamificationRouter from "./gamification.js";
import usersRouter from "./users.js";
import reportsRouter from "./reports.js";
import notificationsRouter from "./notifications.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/events", eventsRouter);
// Report endpoints live under /events/* (POST /:id/report, admin/reports/*)
// to keep report URLs alongside the event they're about.
router.use("/events", reportsRouter);
router.use("/tickets", ticketsRouter);
router.use("/payments", paymentsRouter);
router.use("/payouts", payoutsRouter);
router.use("/fx", fxRouter);
router.use("/users", usersRouter);
router.use("/notifications", notificationsRouter);
router.use(gamificationRouter);

export default router;

