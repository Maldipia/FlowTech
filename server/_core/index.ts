import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerChatRoutes } from "./chat";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import Stripe from "stripe";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // ── Security Headers ─────────────────────────────────────────────────────
  app.use((_req, res, next) => {
    res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    res.removeHeader("X-Powered-By");
    next();
  });

  // ── Stripe Webhook (must be BEFORE express.json so raw body is preserved) ─
  if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    app.post(
      "/api/stripe/webhook",
      express.raw({ type: "application/json" }),
      async (req, res) => {
        const sig = req.headers["stripe-signature"];
        // Handle Stripe test events
        let event: Stripe.Event;
        try {
          event = stripe.webhooks.constructEvent(
            req.body,
            sig as string,
            process.env.STRIPE_WEBHOOK_SECRET!
          );
        } catch (err: any) {
          console.error("[Webhook] Signature verification failed:", err.message);
          return res.status(400).send(`Webhook Error: ${err.message}`);
        }
        // Test event passthrough
        if (event.id.startsWith("evt_test_")) {
          console.log("[Webhook] Test event detected");
          return res.json({ verified: true });
        }
        console.log(`[Webhook] Event: ${event.type} (${event.id})`);
        // Handle events
        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            console.log(`[Webhook] Checkout completed: ${session.id}, customer: ${session.customer}`);
            break;
          }
          case "payment_intent.succeeded": {
            const pi = event.data.object as Stripe.PaymentIntent;
            console.log(`[Webhook] Payment succeeded: ${pi.id}`);
            break;
          }
          case "customer.subscription.deleted":
          case "customer.subscription.updated": {
            const sub = event.data.object as Stripe.Subscription;
            console.log(`[Webhook] Subscription ${event.type}: ${sub.id}`);
            break;
          }
          default:
            console.log(`[Webhook] Unhandled event type: ${event.type}`);
        }
        res.json({ received: true });
      }
    );
  }

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // Chat API with streaming and tool calling
  registerChatRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
