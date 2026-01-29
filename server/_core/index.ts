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
  
  // List all blog post slugs endpoint
  app.get("/api/list-blog-slugs", async (_req, res) => {
    try {

      const { getDb } = await import("../db");
      const schema = await import("../../drizzle/schema");
      const db = await getDb();
      
      if (!db) {
        res.status(500).json({ error: "Database not available" });
        return;
      }

      const posts = await db.select({
        slug: schema.blogPosts.slug,
        title: schema.blogPosts.title,
        published: schema.blogPosts.published
      }).from(schema.blogPosts);

      res.json({
        success: true,
        total: posts.length,
        posts
      });
    } catch (error: any) {
      console.error('Error listing blog slugs:', error);
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
          slug: 'comprar-en-amazon-desde-colombia-guia-con-amazon-gift-cards',
          metaTitle: 'Comprar en Amazon desde Colombia con Gift Cards (Guía 2026)',
          metaDescription: 'Aprende a comprar en Amazon USA desde Colombia sin tarjeta de crédito. Usa Amazon Gift Cards para pagar de forma segura, rápida y controlar tus gastos. ¡Guía completa!',
          metaKeywords: 'Comprar Amazon Colombia, Amazon Gift Card, pagar Amazon sin tarjeta de crédito, casillero virtual Colombia, Amazon USA desde Colombia'
        },
        {
          slug: 'como-comprar-tarjetas-psn-colombia-guia-2026',
          metaTitle: 'Tarjetas PSN Colombia: Guía 2026 para Comprar en PlayStation Store',
          metaDescription: 'Descubre dónde y cómo comprar Tarjetas PSN en Colombia de forma segura. Guía completa para recargar tu monedero de PlayStation Store (USA o Colombia) y comprar juegos.',
          metaKeywords: 'Tarjetas PSN Colombia, comprar PSN Colombia, PlayStation Store Colombia, recargar PSN Colombia, gift card PSN'
        },
        {
          slug: 'google-play-vs-apple-gift-cards',
          metaTitle: 'Tarjetas Google Play Colombia: Comprar Saldo y Diamantes Free Fire',
          metaDescription: 'Guía completa para comprar y canjear Tarjetas Google Play en Colombia. Recarga tu saldo, compra apps y adquiere diamantes para Free Fire de forma segura y rápida.',
          metaKeywords: 'Tarjetas Google Play Colombia, saldo Google Play, diamantes Free Fire Colombia, recargar Google Play, gift card Google Play'
        },
        {
          slug: 'mejores-tarjetas-regalo-mes',
          metaTitle: 'Las 5 Mejores Gift Cards para Regalar en Colombia (2026)',
          metaDescription: '¿No sabes qué regalar? Descubre el Top 5 de las Gift Cards más populares y versátiles para regalar en Colombia en 2026. ¡El regalo digital perfecto!',
          metaKeywords: 'Mejores gift cards Colombia, regalos digitales, tarjetas de regalo, qué regalar en Colombia, ideas de regalo'
        },
        {
          slug: 'steam-colombia-gift-cards',
          metaTitle: 'Steam Colombia: Cómo Recargar Saldo y Aprovechar Ofertas (2026)',
          metaDescription: 'Aprende a recargar tu billetera de Steam en Colombia de forma fácil y segura con tarjetas de regalo. ¡Prepárate para las ofertas de verano e invierno!',
          metaKeywords: 'Steam Colombia, recargar Steam Colombia, Steam Wallet, tarjetas de regalo Steam, ofertas Steam'
        },
        {
          slug: 'novedades-steam-ofertas-recarga',
          metaTitle: 'Novedades en Steam: Ofertas de Temporada y Cómo Recargar Saldo (2026)',
          metaDescription: '¡Prepárate para las rebajas de Steam 2026! Descubre el calendario oficial de ofertas y aprende la forma más segura de recargar saldo Steam en Colombia.',
          metaKeywords: 'Steam ofertas 2026, rebajas Steam, calendario Steam, recargar Steam Colombia, Steam Wallet'
        },
        {
          slug: 'netflix-spotify-colombia-gift-cards',
          metaTitle: 'Pagar Netflix y Spotify en Colombia sin Tarjeta de Crédito (Guía 2026)',
          metaDescription: 'Aprende a pagar tus suscripciones de Netflix y Spotify Premium en Colombia usando tarjetas de regalo. La forma más segura y fácil sin vincular tu tarjeta de crédito.',
          metaKeywords: 'Pagar Netflix Colombia, Spotify Premium sin tarjeta, tarjetas Netflix Colombia, gift card Spotify, entretenimiento digital'
        },
        {
          slug: 'xbox-game-pass-colombia-guia',
          metaTitle: 'Tarjetas Xbox Game Pass: El Netflix de los Videojuegos en Colombia',
          metaDescription: 'Descubre por qué Xbox Game Pass es el servicio imprescindible para todo gamer en Colombia. Guía completa para comprar y activar tu suscripción sin tarjeta de crédito.',
          metaKeywords: 'Xbox Game Pass Colombia, suscripción Xbox, Game Pass Ultimate, tarjetas Xbox Colombia, Netflix videojuegos'
        },
        {
          slug: 'como-canjear-tarjeta-amazon-colombia',
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
  
  // Seed FAQs endpoint
  app.post("/api/seed-faqs-psn", async (req, res) => {
    try {
      const { secret } = req.body;
      
      if (secret !== "seed-faqs-psn-2026") {
        res.status(401).json({ error: "Invalid secret" });
        return;
      }

      const { createFAQ } = await import("../db");
      
      const faqs = [
        {
          question: '¿Qué es una Tarjeta PSN USA y para qué sirve?',
          answer: 'Una Tarjeta PSN USA (o Gift Card de PlayStation Store) es un código digital prepagado que te permite agregar saldo en dólares (USD) a tu cuenta de PlayStation Network (PSN) de la región de Estados Unidos. Sirve para comprar juegos digitales para PS5 y PS4, expansiones y DLCs (contenido descargable), pases de temporada, suscripciones como PlayStation Plus (Essential, Extra, Deluxe), y películas y series en la PlayStation Store.',
          order: 1,
          published: true
        },
        {
          question: '¿Por qué un usuario en Colombia compraría una Tarjeta PSN de USA?',
          answer: 'Muchos gamers en Colombia prefieren usar la PlayStation Store de USA por varias razones: el catálogo es más amplio con juegos y ofertas que no están disponibles en la tienda de Colombia, algunos juegos se lanzan primero en la tienda de USA, los precios en dólares pueden ser más favorables especialmente durante ofertas, y la tienda de USA no cobra impuestos adicionales si usas una dirección de un estado sin impuestos sobre las ventas (como Oregón o Delaware).',
          order: 2,
          published: true
        },
        {
          question: '¿Puedo usar una Tarjeta PSN de USA en mi cuenta de PSN de Colombia?',
          answer: 'No, no es posible. Las tarjetas PSN están bloqueadas por región. Una tarjeta de USA solo funciona en una cuenta de PSN de USA. Si intentas canjearla en una cuenta colombiana, te saldrá un error.',
          order: 3,
          published: true
        },
        {
          question: '¿Cómo sé de qué región es mi cuenta de PSN?',
          answer: 'Para verificar la región de tu cuenta: 1) Inicia sesión en tu cuenta de PlayStation en un navegador, 2) Ve a Gestión de Cuentas > Información de la cuenta, 3) En la sección País/Región, verás el país de tu cuenta.',
          order: 4,
          published: true
        },
        {
          question: '¿Puedo cambiar la región de mi cuenta de PSN?',
          answer: 'No. Una vez que creas una cuenta de PlayStation, no puedes cambiar su región. Si tienes una cuenta colombiana y quieres usar la tienda de USA, necesitas crear una nueva cuenta de PSN de la región de Estados Unidos.',
          order: 5,
          published: true
        },
        {
          question: '¿Es legal tener una cuenta de PSN de USA viviendo en Colombia?',
          answer: 'Sí, es completamente legal. No hay ninguna restricción que te impida crear y usar una cuenta de otra región. Sin embargo, ten en cuenta que no podrás usar métodos de pago colombianos directamente en la tienda de USA.',
          order: 6,
          published: true
        },
        {
          question: '¿Cómo puedo comprar en la PlayStation Store de USA desde Colombia?',
          answer: 'Como no puedes usar tarjetas de crédito o débito colombianas, la forma más fácil y segura es a través de Tarjetas PSN de USA: 1) Compra una Tarjeta PSN USA en un sitio confiable como GiftCards.com.co, 2) Recibe el código digital al instante en tu correo, 3) Canjea el código en tu cuenta de PSN de USA, 4) Usa el saldo para comprar lo que quieras en la PlayStation Store.',
          order: 7,
          published: true
        },
        {
          question: '¿Qué necesito para crear una cuenta de PSN de USA?',
          answer: 'Necesitas un correo electrónico que no esté asociado a otra cuenta de PSN, y una dirección de Estados Unidos. Puedes usar una dirección de un estado sin impuestos sobre las ventas, como: Estado: Oregón (OR), Ciudad: Portland, Código Postal: 97201.',
          order: 8,
          published: true
        },
        {
          question: '¿El código de la tarjeta tiene fecha de vencimiento?',
          answer: 'No. Los códigos de las Tarjetas PSN no tienen fecha de vencimiento. Puedes canjearlos cuando quieras. Sin embargo, una vez canjeado, el saldo se agrega a tu monedero y queda sujeto a los términos de servicio de Sony.',
          order: 9,
          published: true
        },
        {
          question: 'Si compro un juego con mi cuenta de USA, ¿puedo jugarlo en mi cuenta de Colombia?',
          answer: 'Sí. Esta es una de las grandes ventajas. En tu consola (PS4 o PS5), activa tu cuenta de USA como principal. En PS5: Ve a Configuración > Usuarios y cuentas > Otros > Uso compartido de consola y juego offline y selecciona Activar. En PS4: Ve a Configuración > Administración de cuentas > Activar como tu PS4 principal y selecciona Activar. Luego compra y descarga el juego con tu cuenta de USA, cambia a tu cuenta de Colombia, y el juego estará disponible para jugar con tu progreso, trofeos y amigos de tu cuenta principal colombiana.',
          order: 10,
          published: true
        },
        {
          question: '¿Los DLCs que compre con la cuenta de USA funcionarán con un juego que compré en Colombia?',
          answer: 'No, generalmente no. Los juegos y los DLCs deben ser de la misma región para ser compatibles. Si compraste el juego físico en Colombia (Región ALL o LATAM), el DLC de la tienda de USA no funcionará. Recomendación: Compra siempre el juego y sus DLCs en la misma tienda regional.',
          order: 11,
          published: true
        },
        {
          question: 'Ingresé el código y me dice que no es válido. ¿Qué hago?',
          answer: 'Verifica estos puntos: 1) Región: Asegúrate de que estás canjeando el código en una cuenta de PSN de Estados Unidos, 2) Tipeo: Revisa que hayas ingresado los 12 dígitos correctamente, sin guiones, 3) Estado de PSN: Comprueba si hay algún problema con los servicios de PlayStation en status.playstation.com, 4) Soporte: Si todo lo anterior está correcto, contacta al soporte de la tienda donde compraste la tarjeta.',
          order: 12,
          published: true
        }
      ];
      
      const results = [];
      for (const faq of faqs) {
        try {
          await createFAQ(faq);
          results.push({ question: faq.question, status: 'success' });
        } catch (error: any) {
          results.push({ question: faq.question, status: 'error', error: error.message });
        }
      }
      
      res.json({
        message: 'FAQs seeded successfully',
        results
      });
    } catch (error: any) {
      console.error('Error seeding FAQs:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  // Update Amazon Gift Cards product endpoint
  app.post("/api/update-amazon-product", async (req, res) => {
    try {
      const { secret } = req.body;
      
      if (secret !== "update-amazon-seo-2026") {
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

      const metaTitle = "Amazon Colombia: Compra con Gift Cards USA | Entrega Inmediata";
      const metaDescription = "Compra en Amazon USA desde Colombia sin tarjeta de crédito. Usa nuestras Amazon Gift Cards para pagar de forma segura y controlar tus gastos. ¡Recibe tu código al instante!";
      const fullDescription = `<h3>¿Cómo Comprar en Amazon desde Colombia? ¡La Solución es una Amazon Gift Card!</h3>\n\n<p>¿Siempre has querido acceder al inmenso catálogo de <strong>Amazon USA</strong> pero te frena no tener una tarjeta de crédito internacional o los complicados procesos de envío? ¡Tenemos la solución perfecta para ti! Con una <strong>Amazon Gift Card</strong>, puedes <strong>comprar en Amazon desde Colombia</strong> de forma fácil, rápida y segura.</p>\n\n<p>Olvida las barreras y empieza a disfrutar de millones de productos exclusivos de la tienda de Estados Unidos. Desde lo último en tecnología hasta moda, libros y mucho más. Nuestras <strong>tarjetas de regalo Amazon</strong> son tu pasaporte al mercado más grande del mundo.</p>\n\n<h3>Beneficios de Usar una Tarjeta Amazon en Colombia</h3>\n\n<ul>\n  <li>✅ <strong>Acceso Total a Amazon USA:</strong> Compra cualquier producto del catálogo de Estados Unidos sin restricciones.</li>\n  <li>✅ <strong>Sin Tarjeta de Crédito:</strong> No necesitas una tarjeta internacional. Paga con métodos de pago locales.</li>\n  <li>✅ <strong>Control de Gastos:</strong> Carga solo el saldo que necesitas y evita sorpresas en tu extracto.</li>\n  <li>✅ <strong>Seguridad Garantizada:</strong> No expones tus datos bancarios en línea.</li>\n  <li>✅ <strong>Entrega Inmediata:</strong> Recibe tu código digital al instante en tu correo electrónico.</li>\n  <li>✅ <strong>Regalo Perfecto:</strong> Sorprende a tus amigos y familiares con el regalo que ellos elijan.</li>\n</ul>\n\n<h3>¿Cómo Funciona? Guía Paso a Paso</h3>\n\n<p>Comprar y usar tu <strong>tarjeta Amazon</strong> es muy sencillo:</p>\n\n<ol>\n  <li><strong>Elige el Monto:</strong> Selecciona el valor de la Amazon Gift Card que deseas comprar.</li>\n  <li><strong>Paga con Medios Locales:</strong> Aceptamos una amplia variedad de métodos de pago en Colombia.</li>\n  <li><strong>Recibe tu Código:</strong> En minutos, recibirás el código de la gift card en tu correo.</li>\n  <li><strong>Canjea en Amazon:</strong><br>\n    a. Inicia sesión en tu cuenta de Amazon.com (o crea una nueva).<br>\n    b. Ve a "Cuentas y Listas" y selecciona "Tarjetas de Regalo".<br>\n    c. Haz clic en "Canjear una Tarjeta de Regalo" e ingresa tu código.<br>\n    d. ¡Listo! El saldo se agregará a tu cuenta y podrás empezar a <strong>comprar en Amazon</strong>.\n  </li>\n</ol>\n\n<h3>¿Necesito un Casillero Virtual para Envíos a Colombia?</h3>\n\n<p>Sí. Para los productos que no tienen envío directo a Colombia, necesitarás un <strong>casillero virtual</strong>. Este servicio te proporciona una dirección en Estados Unidos a la que Amazon enviará tus productos. Luego, el casillero se encarga de enviártelos a tu casa en Colombia. Es un proceso seguro y muy común para quienes realizan <strong>compras en Amazon desde Colombia</strong>.</p>\n\n<h3>Preguntas Frecuentes (FAQs)</h3>\n\n<p><strong>¿Las Amazon Gift Cards tienen vencimiento?</strong><br>\nNo, el saldo de tu tarjeta de regalo Amazon no tiene fecha de vencimiento.</p>\n\n<p><strong>¿Puedo usar esta gift card en Amazon España o México?</strong><br>\nNo, estas tarjetas son exclusivamente para la tienda de <strong>Amazon.com (USA)</strong>.</p>\n\n<p><strong>¿Puedo usar el saldo para pagar Amazon Prime Video?</strong><br>\nSí, puedes usar el saldo de tu gift card para pagar tu suscripción a Amazon Prime, que incluye Prime Video, Prime Gaming y envíos gratis en USA.</p>\n\n<p><strong>¿Es seguro comprar una Amazon Gift Card aquí?</strong><br>\nTotalmente. Somos distribuidores autorizados y garantizamos que todos nuestros códigos son 100% válidos y se entregan de forma segura e inmediata.</p>\n\n<p>¡No esperes más! Compra tu <strong>Amazon Gift Card Colombia</strong> hoy mismo y empieza a disfrutar de un mundo de posibilidades. ¡El catálogo de <strong>Amazon USA</strong> te espera!</p>`;
      
      await db.update(schema.products)
        .set({
          name: metaTitle,
          description: metaDescription,
          fullDescription: fullDescription
        })
        .where(eq(schema.products.slug, 'amazon-gift-cards'));
      
      res.json({
        message: 'Amazon Gift Cards product updated successfully',
        updates: {
          metaTitle,
          metaDescription,
          fullDescriptionLength: fullDescription.length
        }
      });
    } catch (error: any) {
      console.error('Error updating Amazon product:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  // Update Nintendo eShop product endpoint
  app.post("/api/update-nintendo-product", async (req, res) => {
    try {
      const { secret } = req.body;
      
      if (secret !== "update-nintendo-seo-2026") {
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

      const metaTitle = "Nintendo Switch Colombia: Tarjetas eShop | Entrega Inmediata";
      const metaDescription = "Compra tarjetas para la Nintendo eShop en Colombia y recarga tu saldo para Nintendo Switch. Accede a juegos, DLCs y más. ¡Recibe tu código digital al instante!";
      const fullDescription = `<h3>Recarga tu Nintendo Switch en Colombia: ¡Juegos Digitales al Instante!</h3>\n\n<p>¿Buscas la forma más fácil de comprar juegos para tu <strong>Nintendo Switch</strong> en <strong>Colombia</strong>? Con nuestras <strong>tarjetas de regalo para la Nintendo eShop</strong>, puedes recargar tu saldo en segundos y acceder a un universo de entretenimiento digital. Olvídate de las tarjetas de crédito y los complicados procesos de compra. ¡Es rápido, seguro y al instante!</p>\n\n<p>La <strong>Nintendo eShop</strong> es la tienda digital oficial de Nintendo, donde encontrarás miles de juegos, desde los grandes lanzamientos de Mario y Zelda hasta joyas independientes. Con una <strong>tarjeta eShop</strong>, tienes el control total de tus gastos y acceso inmediato a todo el catálogo.</p>\n\n<h3>Beneficios de Usar una Tarjeta Nintendo eShop</h3>\n\n<ul>\n  <li>✅ <strong>Acceso a la eShop de USA:</strong> Compra en la tienda con el catálogo más grande y, a menudo, mejores precios.</li>\n  <li>✅ <strong>Sin Tarjeta de Crédito:</strong> No necesitas una tarjeta internacional. Paga con métodos de pago locales.</li>\n  <li>✅ <strong>Control Total:</strong> Carga solo el saldo que necesitas y gestiona tu presupuesto gamer.</li>\n  <li>✅ <strong>Entrega Inmediata:</strong> Recibe tu código digital al instante en tu correo electrónico y WhatsApp.</li>\n  <li>✅ <strong>Regalo Ideal para Gamers:</strong> La mejor opción para sorprender a cualquier fan de <strong>Nintendo Switch</strong>.</li>\n  <li>✅ <strong>Compatible con Nintendo Switch 2:</strong> ¡Prepárate para el futuro! Este saldo será compatible con la próxima consola de Nintendo.</li>\n</ul>\n\n<h3>¿Cómo Canjear tu Tarjeta eShop en tu Nintendo Switch?</h3>\n\n<p>Canjear tu código es muy sencillo. Sigue estos pasos:</p>\n\n<ol>\n  <li>En el menú HOME de tu <strong>Nintendo Switch</strong>, selecciona el ícono de la <strong>Nintendo eShop</strong>.</li>\n  <li>Selecciona tu perfil de usuario (asegúrate de que sea de la región de USA).</li>\n  <li>En el menú de la izquierda, elige "Canjear código".</li>\n  <li>Ingresa el código de 16 dígitos que recibiste.</li>\n  <li>¡Listo! El saldo se agregará a tu cuenta y podrás empezar a comprar.</li>\n</ol>\n\n<h3>Preguntas Frecuentes (FAQs)</h3>\n\n<p><strong>¿Necesito una cuenta de USA para usar estas tarjetas?</strong><br>\nSí, estas tarjetas son para la eShop de Estados Unidos. Si no tienes una cuenta de USA, puedes crear una fácilmente. Es la región con el catálogo más completo.</p>\n\n<p><strong>¿Puedo usar estas tarjetas en una cuenta de Colombia?</strong><br>\nNo, las tarjetas de la eShop están bloqueadas por región. Estas son exclusivamente para cuentas de USA.</p>\n\n<p><strong>¿El saldo de la eShop tiene vencimiento?</strong><br>\nNo, el saldo que agregues a tu cuenta de Nintendo no tiene fecha de vencimiento.</p>\n\n<p><strong>¿Qué pasa si compro un juego digital y no me gusta?</strong><br>\nGeneralmente, las compras en la Nintendo eShop son finales y no se ofrecen reembolsos, salvo en casos excepcionales. Te recomendamos ver gameplays y leer reseñas antes de comprar.</p>\n\n<p>¡No esperes más para ampliar tu biblioteca de juegos! Compra tu <strong>tarjeta Nintendo eShop Colombia</strong> hoy y sumérgete en nuevas aventuras en tu <strong>Nintendo Switch</strong>.</p>`;
      
      await db.update(schema.products)
        .set({
          name: metaTitle,
          description: metaDescription,
          fullDescription: fullDescription
        })
        .where(eq(schema.products.slug, 'nintendo-eshop'));
      
      res.json({
        message: 'Nintendo eShop product updated successfully',
        updates: {
          metaTitle,
          metaDescription,
          fullDescriptionLength: fullDescription.length
        }
      });
    } catch (error: any) {
      console.error('Error updating Nintendo product:', error);
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
