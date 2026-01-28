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
  
  // Upload images endpoint removed - now using Cloudinary via tRPC
  // Update product images endpoint
  app.post("/api/update-product-images", async (req, res) => {
    try {
      const { secret, imageUrls } = req.body;
      
      if (secret !== "update-images-2025") {
        res.status(401).json({ error: "Invalid secret" });
        return;
      }

      const { getDb } = await import("../db");
      const schema = await import("../../drizzle/schema");
      const { eq } = await import("drizzle-orm");
      const db = await getDb();
      
      if (!db) {
        res.status(500).json({ error: "Database not available" });
        return;
      }

      const results = [];

      for (const [slug, imageUrl] of Object.entries(imageUrls as Record<string, string>)) {
        await db.update(schema.products)
          .set({ image: imageUrl as string })
          .where(eq(schema.products.slug, slug));
        
        results.push({ slug, imageUrl });
      }

      res.json({ 
        success: true, 
        message: "Product images updated successfully",
        updated: results
      });
    } catch (error: any) {
      console.error("Error updating product images:", error);
      res.status(500).json({ error: error.message });
    }
  });

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
  
  // Add metaTitle column migration endpoint
  app.post("/api/migrate-add-meta-title", async (req, res) => {
    try {
      const { secret } = req.body;
      
      if (secret !== "update-blog-seo-2026") {
        res.status(401).json({ error: "Invalid secret" });
        return;
      }

      const { getDb } = await import("../db");
      const db = await getDb();
      
      if (!db) {
        res.status(500).json({ error: "Database not available" });
        return;
      }

      try {
        // Check if column already exists
        const checkResult = await db.execute(`
          SELECT COUNT(*) as count 
          FROM information_schema.COLUMNS 
          WHERE TABLE_SCHEMA = DATABASE() 
          AND TABLE_NAME = 'blog_posts' 
          AND COLUMN_NAME = 'metaTitle'
        `);
        
        const exists = (checkResult as any)[0]?.[0]?.count > 0;
        
        if (exists) {
          res.json({
            success: true,
            message: "Column metaTitle already exists",
            alreadyExists: true
          });
          return;
        }

        // Add the column
        await db.execute(`
          ALTER TABLE blog_posts 
          ADD COLUMN metaTitle TEXT AFTER featuredImage
        `);

        res.json({
          success: true,
          message: "Column metaTitle added successfully"
        });
      } catch (error: any) {
        console.error('Error adding metaTitle column:', error);
        res.status(500).json({ error: error.message });
      }
    } catch (error: any) {
      console.error('Error in migration endpoint:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  // Update blog metadata endpoint
  app.post("/api/update-blog-metadata", async (req, res) => {
    try {
      const { secret } = req.body;
      
      if (secret !== "update-blog-seo-2026") {
        res.status(401).json({ error: "Invalid secret" });
        return;
      }

      const { getDb } = await import("../db");
      const schema = await import("../../drizzle/schema");
      const { eq } = await import("drizzle-orm");
      const db = await getDb();
      
      if (!db) {
        res.status(500).json({ error: "Database not available" });
        return;
      }

      const metadataUpdates = [
        {
          slug: 'comprar-amazon-colombia-gift-cards',
          metaTitle: 'Comprar en Amazon desde Colombia con Gift Cards (Guía 2026)',
          metaDescription: 'Aprende a comprar en Amazon USA desde Colombia sin tarjeta de crédito. Usa Amazon Gift Cards para pagar de forma segura, rápida y controlar tus gastos. ¡Guía completa!',
          metaKeywords: 'Comprar Amazon Colombia, Amazon Gift Card, pagar Amazon sin tarjeta de crédito, casillero virtual Colombia, Amazon USA desde Colombia'
        },
        {
          slug: 'tarjetas-psn-colombia-guia-2026',
          metaTitle: 'Tarjetas PSN Colombia: Guía 2026 para Comprar en PlayStation Store',
          metaDescription: 'Descubre dónde y cómo comprar Tarjetas PSN en Colombia de forma segura. Guía completa para recargar tu monedero de PlayStation Store (USA o Colombia) y comprar juegos.',
          metaKeywords: 'Tarjetas PSN Colombia, comprar PSN Colombia, PlayStation Store Colombia, recargar PSN Colombia, gift card PSN'
        },
        {
          slug: 'tarjetas-google-play-colombia',
          metaTitle: 'Tarjetas Google Play Colombia: Comprar Saldo y Diamantes Free Fire',
          metaDescription: 'Guía completa para comprar y canjear Tarjetas Google Play en Colombia. Recarga tu saldo, compra apps y adquiere diamantes para Free Fire de forma segura y rápida.',
          metaKeywords: 'Tarjetas Google Play Colombia, saldo Google Play, diamantes Free Fire Colombia, recargar Google Play, gift card Google Play'
        },
        {
          slug: 'mejores-gift-cards-colombia-2026',
          metaTitle: 'Las 5 Mejores Gift Cards para Regalar en Colombia (2026)',
          metaDescription: '¿No sabes qué regalar? Descubre el Top 5 de las Gift Cards más populares y versátiles para regalar en Colombia en 2026. ¡El regalo digital perfecto!',
          metaKeywords: 'Mejores gift cards Colombia, regalos digitales, tarjetas de regalo, qué regalar en Colombia, ideas de regalo'
        },
        {
          slug: 'steam-colombia-recargar-billetera',
          metaTitle: 'Steam Colombia: Cómo Recargar Saldo y Aprovechar Ofertas (2026)',
          metaDescription: 'Aprende a recargar tu billetera de Steam en Colombia de forma fácil y segura con tarjetas de regalo. ¡Prepárate para las ofertas de verano e invierno!',
          metaKeywords: 'Steam Colombia, recargar Steam Colombia, Steam Wallet, tarjetas de regalo Steam, ofertas Steam'
        },
        {
          slug: 'comprar-en-amazon-desde-colombia-guia-con-amazon-gift-cards',
          metaTitle: 'Comprar en Amazon desde Colombia: Guía con Amazon Gift Cards',
          metaDescription: 'Aprende a comprar en Amazon USA desde Colombia sin tarjeta de crédito. Usa Amazon Gift Cards para pagar de forma segura y controlar tus gastos.',
          metaKeywords: 'Comprar Amazon Colombia Gift Card, amazon colombia, tarjetas regalo amazon, pagar amazon sin tarjeta de crédito, amazon usa desde colombia'
        },
        {
          slug: 'novedades-steam-ofertas-temporada-recargar-saldo',
          metaTitle: 'Novedades en Steam: Ofertas de Temporada y Cómo Recargar Saldo (2026)',
          metaDescription: '¡Prepárate para las rebajas de Steam 2026! Descubre el calendario oficial de ofertas y aprende la forma más segura de recargar saldo Steam en Colombia.',
          metaKeywords: 'Steam ofertas 2026, rebajas Steam, calendario Steam, recargar Steam Colombia, Steam Wallet'
        },
        {
          slug: 'como-comprar-tarjetas-psn-colombia-guia-completa-2026',
          metaTitle: 'Cómo comprar Tarjetas PSN en Colombia: Guía Completa 2026',
          metaDescription: 'Descubre la guía definitiva para comprar y canjear Tarjetas PSN en Colombia este 2026. Aprende cómo recargar tu cuenta de PlayStation Store sin tarjeta de crédito.',
          metaKeywords: 'Tarjetas PSN Colombia, comprar psn colombia, playstation store colombia, tarjetas regalo playstation, recargar psn colombia'
        },
        {
          slug: 'netflix-spotify-entretenimiento-sin-tarjetas-credito',
          metaTitle: 'Pagar Netflix y Spotify en Colombia sin Tarjeta de Crédito (Guía 2026)',
          metaDescription: 'Aprende a pagar tus suscripciones de Netflix y Spotify Premium en Colombia usando tarjetas de regalo. La forma más segura y fácil sin vincular tu tarjeta de crédito.',
          metaKeywords: 'Pagar Netflix Colombia, Spotify Premium sin tarjeta, tarjetas Netflix Colombia, gift card Spotify, entretenimiento digital'
        },
        {
          slug: 'steam-colombia-guia-compra-gamers',
          metaTitle: 'Steam Colombia: Guía de Compra para Gamers (2026)',
          metaDescription: '¡Domina Steam desde Colombia! Guía definitiva para recargar tu saldo de Steam Wallet, aprovechar ofertas y comprar juegos sin tarjeta de crédito internacional.',
          metaKeywords: 'Steam Colombia, guía Steam, comprar juegos Steam Colombia, Steam Wallet Colombia, gamers Colombia'
        },
        {
          slug: 'las-5-mejores-tarjetas-regalo-regalar-mes',
          metaTitle: 'Las 5 Mejores Tarjetas de Regalo para Regalar este Mes (2026)',
          metaDescription: '¿No sabes qué regalar? Las tarjetas de regalo digitales son la solución perfecta. Descubre el Top 5 de gift cards más populares en Colombia.',
          metaKeywords: 'mejores tarjetas regalo Colombia, gift cards populares, qué regalar Colombia, regalos digitales, ideas regalo 2026'
        },
        {
          slug: 'tarjetas-xbox-game-pass-netflix-videojuegos-colombia',
          metaTitle: 'Tarjetas Xbox Game Pass: El Netflix de los Videojuegos en Colombia',
          metaDescription: 'Descubre por qué Xbox Game Pass es el servicio imprescindible para todo gamer en Colombia. Guía completa para comprar y activar tu suscripción sin tarjeta de crédito.',
          metaKeywords: 'Xbox Game Pass Colombia, suscripción Xbox, Game Pass Ultimate, tarjetas Xbox Colombia, Netflix videojuegos'
        },
        {
          slug: 'google-play-vs-apple-gift-cards-cual-elegir',
          metaTitle: 'Google Play vs Apple Gift Cards: ¿Cuál Elegir? (Guía Colombia 2026)',
          metaDescription: '¿Android o iOS? Descubre las diferencias clave entre las tarjetas de regalo de Google Play y Apple en Colombia. Analizamos qué puedes comprar con cada una.',
          metaKeywords: 'Google Play vs Apple, gift cards Colombia, tarjetas Google Play, Apple gift card, Android vs iOS Colombia'
        },
        {
          slug: 'como-canjear-tarjeta-amazon-cuenta-colombia',
          metaTitle: 'Cómo Canjear una Tarjeta Amazon en tu Cuenta de Colombia (2026)',
          metaDescription: '¿Recibiste una Amazon Gift Card y no sabes cómo usarla? Aprende paso a paso cómo canjear tu tarjeta de regalo Amazon desde Colombia de forma fácil y segura.',
          metaKeywords: 'canjear Amazon Colombia, redeem Amazon gift card, usar tarjeta Amazon Colombia, Amazon gift card Colombia'
        }
      ];

      let updated = 0;
      let notFound = 0;
      const results = [];

      for (const update of metadataUpdates) {
        try {
          const existing = await db.select()
            .from(schema.blogPosts)
            .where(eq(schema.blogPosts.slug, update.slug))
            .limit(1);
          
          if (existing.length === 0) {
            notFound++;
            results.push({ slug: update.slug, status: 'not_found' });
            continue;
          }
          
          await db.update(schema.blogPosts)
            .set({
              metaTitle: update.metaTitle,
              metaDescription: update.metaDescription,
              metaKeywords: update.metaKeywords,
              updatedAt: new Date()
            })
            .where(eq(schema.blogPosts.slug, update.slug));
          
          updated++;
          results.push({ slug: update.slug, status: 'updated', title: update.metaTitle });
        } catch (error: any) {
          results.push({ slug: update.slug, status: 'error', error: error.message });
        }
      }

      res.json({
        success: true,
        message: "Blog metadata updated successfully",
        summary: {
          updated,
          notFound,
          total: metadataUpdates.length
        },
        results
      });
    } catch (error: any) {
      console.error('Error updating blog metadata:', error);
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
