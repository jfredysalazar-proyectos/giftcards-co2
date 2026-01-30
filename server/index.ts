import express from "express";
import { createServer } from "http";
import { setupVite, serveStatic } from "./_core/vite.js";

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Setup SSR with Vite (development) or serve static files with SSR (production)
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    await setupVite(app, server);
  }

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
