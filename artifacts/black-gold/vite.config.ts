import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

// import.meta.dirname was only added in Node 20.11.0.
// Vercel's Node 20 runtime is often an older patch — use the
// fileURLToPath pattern instead so builds work on any ESM-capable Node.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isBuild =
  process.env.NODE_ENV === "production" || process.argv.includes("build");

const rawPort = process.env.PORT;
const port = rawPort ? Number(rawPort) : 5173;

// BASE_PATH is a Replit-specific env var; on Vercel it is simply absent → "/"
const basePath = process.env.BASE_PATH ?? "/";

if (!isBuild) {
  if (!rawPort) {
    throw new Error("PORT environment variable is required but was not provided.");
  }
  if (Number.isNaN(port) || port <= 0) {
    throw new Error(`Invalid PORT value: "${rawPort}"`);
  }
  if (!process.env.BASE_PATH) {
    throw new Error("BASE_PATH environment variable is required but was not provided.");
  }
}

export default defineConfig({
  base: basePath,
  css: {
    postcss: {
      plugins: [
        tailwindcss({ config: path.resolve(__dirname, "tailwind.config.cjs") }),
        autoprefixer(),
      ],
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@assets": path.resolve(__dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(__dirname),
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      allow: [
        path.resolve(__dirname),
        path.resolve(__dirname, "..", "..", "attached_assets"),
      ],
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
