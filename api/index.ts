/**
 * Vercel Serverless Function — API entry point
 *
 * @vercel/node detects this file, compiles it with esbuild, and wraps the
 * exported Express app as a serverless handler. All requests to /api/* on
 * the Vercel deployment are routed here by vercel.json.
 *
 * Required environment variables (set in Vercel project settings):
 *   DATABASE_URL  — PostgreSQL connection string (Neon, Supabase, etc.)
 *   SESSION_SECRET — Secret used for signed cookies / sessions
 */
import app from "../artifacts/api-server/src/app";

export default app;
