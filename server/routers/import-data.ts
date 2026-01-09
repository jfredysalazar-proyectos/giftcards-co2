import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import * as schema from "../../drizzle/schema";

export const importDataRouter = router({
  importAll: publicProcedure
    .input(z.object({ secret: z.string() }))
    .mutation(async ({ input }) => {
      if (input.secret !== "import-data-2025") {
        throw new Error("Invalid secret");
      }

      const db = getDb();
      if (!db) {
        throw new Error("Database not available");
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

      return {
        success: true,
        message: "Data imported successfully",
        results,
      };
    }),
});
