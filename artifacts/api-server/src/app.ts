import express, { type Express } from "express";
import type { IncomingMessage, ServerResponse } from "http";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import * as pinoHttpImport from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

// Handle CJS/ESM interop for pino-http
const pinoHttp = (pinoHttpImport as any).default ?? pinoHttpImport;

const app: Express = express();

/* ── Security headers (Helmet) ── */
// TypeScript in some environments complains about the helmet import's call signature.
// Cast to `any` here to satisfy the compiler while preserving the runtime behavior.
app.use(
  (helmet as unknown as (...args: any[]) => any)({
    contentSecurityPolicy: false, // Disabled for API-only server (frontend handles CSP)
    crossOriginEmbedderPolicy: false,
  }),
);

/* ── Global rate limiter: 120 requests per minute per IP ── */
const globalLimiter = rateLimit({
  windowMs: 60_000,
  max: 120,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many requests, please slow down." },
  skip: (req) => req.method === "GET", // Only rate-limit writes globally
});
app.use(globalLimiter);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req: IncomingMessage & { id?: string; method?: string; url?: string }) {
        return {
          id: (req as any).id,
          method: req.method,
          url: (req.url as string)?.split("?")[0],
        };
      },
      res(res: ServerResponse & { statusCode?: number }) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

app.use("/api", router);

export default app;
