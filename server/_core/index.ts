import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

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
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // Sitemap.xml endpoint
  app.get("/sitemap.xml", async (_req, res) => {
    try {
      const { getDb } = await import("../db");
      const { products, categories } = await import("../../drizzle/schema");
      const db = await getDb();
      
      if (!db) {
        res.status(500).send('Database not available');
        return;
      }
      
      const baseUrl = process.env.VITE_APP_URL || "https://giftcards-co.manus.space";
      const currentDate = new Date().toISOString().split('T')[0];
      
      // Fetch all products and categories
      const allProducts = await db.select().from(products);
      const allCategories = await db.select().from(categories);
      
      // Build sitemap XML
      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      
      // Homepage
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/</loc>\n`;
      xml += `    <lastmod>${currentDate}</lastmod>\n`;
      xml += '    <changefreq>daily</changefreq>\n';
      xml += '    <priority>1.0</priority>\n';
      xml += '  </url>\n';
      
      // Products
      for (const product of allProducts) {
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/product/${product.slug}</loc>\n`;
        xml += `    <lastmod>${currentDate}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.8</priority>\n';
        xml += '  </url>\n';
      }
      
      // Static pages
      const staticPages = [
        { path: '/faq', priority: '0.6', changefreq: 'monthly' },
        { path: '/help', priority: '0.6', changefreq: 'monthly' },
        { path: '/contact', priority: '0.5', changefreq: 'monthly' },
        { path: '/terms', priority: '0.4', changefreq: 'yearly' },
        { path: '/privacy', priority: '0.4', changefreq: 'yearly' },
        { path: '/refund', priority: '0.4', changefreq: 'yearly' },
      ];
      
      for (const page of staticPages) {
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}${page.path}</loc>\n`;
        xml += `    <lastmod>${currentDate}</lastmod>\n`;
        xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
        xml += `    <priority>${page.priority}</priority>\n`;
        xml += '  </url>\n';
      }
      
      xml += '</urlset>';
      
      res.header('Content-Type', 'application/xml');
      res.send(xml);
    } catch (error) {
      console.error('Error generating sitemap:', error);
      res.status(500).send('Error generating sitemap');
    }
  });
  
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
