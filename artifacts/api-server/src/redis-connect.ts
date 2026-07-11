// express-rate-limit's RedisStore sends its first command while the
// rate-limiting middleware is being constructed in app.ts, so the Redis
// client must already be connected before that module is evaluated. The
// top-level await here blocks module evaluation of anything imported after
// it (see index.ts import order) until the connection is ready.
import { connectRedis } from "./lib/redis.js";

await connectRedis();
