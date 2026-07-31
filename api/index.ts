/**
 * Vercel Serverless Function — API entry point
 *
 * @vercel/node detects this file, compiles it with esbuild, and wraps the
 * exported Express app as a serverless handler. All requests matching
 * /api/(.*) in vercel.json are routed here.
 *
 * Required environment variables (set in Vercel project → Settings → Env Vars):
 *   DATABASE_URL   — PostgreSQL connection string (Neon, Supabase, Vercel Postgres…)
 *   SESSION_SECRET — Secret for signed cookies / sessions
 */
import app from "../artifacts/api-server/src/app";

export default app;
