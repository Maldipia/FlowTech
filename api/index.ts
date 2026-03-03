// This file is the Vercel serverless entry point.
// It imports the pre-built Express app from dist/index.js
// The build command (pnpm build) compiles server/_core/index.ts → dist/index.js via esbuild
// @vercel/node will transpile this file and resolve the import at runtime

// We need to export the Express app as the default export for Vercel
// Since dist/index.js starts the server directly, we need a separate app export

import "dotenv/config";
import express, { type Request, type Response, type NextFunction } from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";
import { registerOAuthRoutes } from "../server/_core/oauth";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// OAuth routes
registerOAuthRoutes(app);

// tRPC
app.use(
  "/api/trpc",
  createExpressMiddleware({ router: appRouter, createContext })
);

// Static files — dist/public is built by vite build and included via includeFiles
const distPath = path.resolve(__dirname, "..", "dist", "public");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// SPA fallback
app.use("*", (_req: Request, res: Response) => {
  const indexPath = path.resolve(distPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send(`
      <!DOCTYPE html>
      <html><body>
        <h2>Flowtech POS</h2>
        <p>Static files not found at: ${distPath}</p>
        <p>Build may be incomplete. Please check Vercel build logs.</p>
      </body></html>
    `);
  }
});

export default app;
