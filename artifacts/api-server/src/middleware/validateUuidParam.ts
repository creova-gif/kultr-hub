import type { Request, Response, NextFunction } from "express";

// Matches Postgres's own uuid input format closely enough for a pre-query
// gate — the DB is still the real validator, this just turns "invalid input
// syntax for type uuid" (a generic 500 from Express's default error handler)
// into a clean 400 before the query ever runs.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Registered via `router.param("id", validateUuidParam)` — runs once for any
 * route on that router whose path includes an `:id` segment, before the
 * matching handler. Any resource keyed by a Drizzle `uuid()` primary key
 * should use this rather than letting a malformed id reach the query.
 */
export function validateUuidParam(
  req: Request,
  res: Response,
  next: NextFunction,
  value: string,
  name: string,
): void {
  if (!UUID_RE.test(value)) {
    res.status(400).json({ message: `${name} must be a valid id` });
    return;
  }
  next();
}
