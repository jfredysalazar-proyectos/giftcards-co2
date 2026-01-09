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
  // Import data endpoint
  app.post("/api/import-data", async (req, res) => {
    try {
      const { secret } = req.body;
      
      if (secret !== "import-data-2025") {
        res.status(401).json({ error: "Invalid secret" });
        return;
      }

      const { getDb } = await import("../db");
      const schema = await import("../../drizzle/schema");
      const db = await getDb();
      
      if (!db) {
        res.status(500).json({ error: "Database not available" });
        return;
      }

      const results = {
        categories: 0,
        products: 0,
        productAmounts: 0,
        faqs: 0,
      };

      // Crear categorías
      const categories = [
        { name: 'Videojuegos', slug: 'videojuegos', description: 'Tarjetas de regalo para videojuegos' },
        { name: 'Compras', slug: 'compras', description: 'Tarjetas de regalo para compras en línea' },
        { name: 'Tecnología', slug: 'tecnologia', description: 'Tarjetas de regalo para tecnología' },
      ];

      const insertedCategories: Record<string, number> = {};

      for (const category of categories) {
        const existing = await db.query.categories.findFirst({
          where: (categories, { eq }) => eq(categories.slug, category.slug),
        });

        if (existing) {
          insertedCategories[category.slug] = existing.id;
        } else {
          const [result] = await db.insert(schema.categories).values(category);
          insertedCategories[category.slug] = result.insertId as number;
          results.categories++;
        }
      }

      // Crear productos
      const products = [
        {
          name: 'PlayStation Network',
          slug: 'playstation-network',
          description: 'Tarjetas PSN para juegos, complementos y suscripciones.',
          fullDescription: 'Tarjetas PlayStation Network para comprar juegos, DLC, suscripciones y más en la PlayStation Store. Compatible con PS4 y PS5.',
          categoryId: insertedCategories['videojuegos'],
          gradient: 'from-blue-600 to-blue-800',
          inStock: true,
          featured: true,
          displayOrder: 1,
        },
        {
          name: 'Amazon Gift Cards',
          slug: 'amazon-gift-cards',
          description: 'Tarjetas de regalo Amazon para compras ilimitadas.',
          fullDescription: 'Tarjetas de regalo Amazon para comprar millones de productos en Amazon.com. Válidas para cualquier categoría de productos.',
          categoryId: insertedCategories['compras'],
          gradient: 'from-orange-500 to-orange-700',
          inStock: true,
          featured: true,
          displayOrder: 2,
        },
        {
          name: 'Nintendo eShop',
          slug: 'nintendo-eshop',
          description: 'Tarjetas Nintendo eShop para Switch y más.',
          fullDescription: 'Tarjetas Nintendo eShop para comprar juegos digitales, DLC y contenido adicional para Nintendo Switch.',
          categoryId: insertedCategories['videojuegos'],
          gradient: 'from-red-600 to-red-800',
          inStock: true,
          featured: true,
          displayOrder: 3,
        },
        {
          name: 'Xbox Gift Card',
          slug: 'xbox-gift-card',
          description: 'Tarjetas de regalo Xbox para juegos y contenido digital',
          fullDescription: 'Tarjetas de regalo Xbox para comprar juegos, aplicaciones, películas y más en la Microsoft Store y Xbox Store.',
          categoryId: insertedCategories['videojuegos'],
          gradient: 'from-green-600 to-green-800',
          inStock: true,
          featured: true,
          displayOrder: 4,
        },
        {
          name: 'Xbox Game Pass',
          slug: 'xbox-game-pass',
          description: 'Tarjetas Game Pass para Xbox membresías Core y Ultimate.',
          fullDescription: 'Tarjetas Xbox Game Pass para acceder a cientos de juegos de alta calidad con suscripciones Core y Ultimate.',
          categoryId: insertedCategories['videojuegos'],
          gradient: 'from-emerald-600 to-emerald-800',
          inStock: true,
          featured: true,
          displayOrder: 5,
        },
      ];

      const insertedProducts: Array<{ id: number; name: string }> = [];

      for (const product of products) {
        const existing = await db.query.products.findFirst({
          where: (products, { eq }) => eq(products.slug, product.slug),
        });

        if (existing) {
          insertedProducts.push({ id: existing.id, name: existing.name });
        } else {
          const [result] = await db.insert(schema.products).values(product);
          insertedProducts.push({ id: result.insertId as number, name: product.name });
          results.products++;
        }
      }

      // Crear precios para cada producto
      const amounts = ['$10', '$25', '$50', '$100'];
      const prices = ['10.00', '25.00', '50.00', '100.00'];

      for (const product of insertedProducts) {
        for (let i = 0; i < amounts.length; i++) {
          const existing = await db.query.productAmounts.findFirst({
            where: (productAmounts, { eq, and }) =>
              and(
                eq(productAmounts.productId, product.id),
                eq(productAmounts.amount, amounts[i])
              ),
          });

          if (!existing) {
            await db.insert(schema.productAmounts).values({
              productId: product.id,
              amount: amounts[i],
              price: prices[i],
            });
            results.productAmounts++;
          }
        }
      }

      // Crear FAQs
      const faqs = [
        {
          question: '¿Cómo funciona la compra de tarjetas de regalo digitales?',
          answer: 'El proceso es muy simple: selecciona el producto que deseas, elige la denominación, agrégalo al carrito y completa el pago. Una vez confirmado el pago, recibirás tu código digital instantáneamente por correo electrónico o WhatsApp.',
          order: 1,
          published: true,
        },
        {
          question: '¿Cuánto tiempo tarda en llegar mi código después de la compra?',
          answer: 'La mayoría de los códigos se entregan instantáneamente después de confirmar el pago. En algunos casos excepcionales, la entrega puede tardar hasta 24 horas.',
          order: 2,
          published: true,
        },
        {
          question: '¿Los códigos tienen fecha de vencimiento?',
          answer: 'Los códigos digitales que vendemos generalmente no tienen fecha de vencimiento, pero esto depende de las políticas del emisor original. Te recomendamos canjear tu código lo antes posible.',
          order: 3,
          published: true,
        },
        {
          question: '¿Cómo canjeo mi código de PlayStation Network (PSN)?',
          answer: 'Para canjear tu código PSN: 1) Inicia sesión en tu cuenta de PlayStation. 2) Ve a PlayStation Store. 3) Selecciona \'Canjear códigos\'. 4) Ingresa el código de 12 dígitos. 5) Confirma y el saldo se agregará a tu billetera PSN.',
          order: 4,
          published: true,
        },
        {
          question: '¿Es seguro comprar en Giftcards.Co?',
          answer: 'Sí, tu seguridad es nuestra prioridad. Utilizamos cifrado SSL/TLS para todas las transacciones y trabajamos con procesadores de pago certificados. Todos nuestros códigos provienen de distribuidores autorizados oficiales.',
          order: 5,
          published: true,
        },
      ];

      for (const faq of faqs) {
        const existing = await db.query.faqs.findFirst({
          where: (faqs, { eq }) => eq(faqs.question, faq.question),
        });

        if (!existing) {
          await db.insert(schema.faqs).values(faq);
          results.faqs++;
        }
      }

      res.json({
        success: true,
        message: "Data imported successfully",
        results,
      });
    } catch (error: any) {
      console.error('Error importing data:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
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
