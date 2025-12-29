import { drizzle } from "drizzle-orm/mysql2";
import { categories, products, productAmounts, faqs } from "../drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Create categories
    console.log("Creating categories...");
    const categoryData = [
      { name: "Videojuegos", slug: "videojuegos", description: "Tarjetas de regalo para plataformas de videojuegos" },
      { name: "Compras", slug: "compras", description: "Tarjetas de regalo para tiendas en línea" },
      { name: "Tecnología", slug: "tecnologia", description: "Tarjetas de regalo para servicios tecnológicos" },
    ];

    for (const cat of categoryData) {
      await db.insert(categories).values(cat);
    }

    // Get category IDs
    const allCategories = await db.select().from(categories);
    const videojuegosId = allCategories.find(c => c.slug === "videojuegos")?.id || 1;
    const comprasId = allCategories.find(c => c.slug === "compras")?.id || 2;
    const tecnologiaId = allCategories.find(c => c.slug === "tecnologia")?.id || 3;
    
    if (!videojuegosId || !comprasId || !tecnologiaId) {
      console.error("❌ Error: Could not find category IDs");
      return;
    }

    // Create products
    console.log("Creating products...");
    const productData = [
      {
        name: "PlayStation Network",
        slug: "playstation-network",
        description: "Tarjetas PSN para juegos, complementos y suscripciones",
        fullDescription: "Compra tarjetas de regalo de PlayStation Network y accede a miles de juegos, complementos, suscripciones PS Plus y contenido exclusivo. Entrega instantánea por WhatsApp.",
        categoryId: videojuegosId,
        image: "/images/product-category-psn.png",
        gradient: "from-purple-700 to-purple-500",
        inStock: true,
        featured: true,
      },
      {
        name: "Xbox Game Pass",
        slug: "xbox-game-pass",
        description: "Tarjetas Xbox y Game Pass para el juego definitivo",
        fullDescription: "Obtén acceso a cientos de juegos de alta calidad con Xbox Game Pass. Incluye juegos del día uno, clásicos y títulos exclusivos. Código entregado al instante.",
        categoryId: videojuegosId,
        image: "/images/product-category-xbox.png",
        gradient: "from-teal-600 to-cyan-500",
        inStock: true,
        featured: true,
      },
      {
        name: "Nintendo eShop",
        slug: "nintendo-eshop",
        description: "Juegos digitales y contenido de Nintendo Switch",
        fullDescription: "Descarga juegos digitales, contenido descargable y más para tu Nintendo Switch. Acceso instantáneo a la tienda eShop con entrega inmediata.",
        categoryId: videojuegosId,
        image: "/images/product-category-nintendo.png",
        gradient: "from-orange-500 to-red-500",
        inStock: true,
        featured: true,
      },
      {
        name: "Tarjetas de Regalo Amazon",
        slug: "amazon-gift-cards",
        description: "Compra cualquier cosa en Amazon con entrega instantánea",
        fullDescription: "Las tarjetas de regalo de Amazon te permiten comprar millones de productos en Amazon.com. Sin fecha de vencimiento, entrega instantánea por WhatsApp.",
        categoryId: comprasId,
        image: "/images/product-category-amazon.png",
        gradient: "from-orange-500 to-yellow-500",
        inStock: true,
        featured: true,
      },
      {
        name: "Billetera Steam",
        slug: "steam-wallet",
        description: "Tarjetas de regalo Steam para tu biblioteca de PC",
        fullDescription: "Agrega fondos a tu billetera de Steam y compra juegos, software, hardware y más. Miles de títulos disponibles con entrega instantánea.",
        categoryId: videojuegosId,
        image: "/images/product-category-psn.png",
        gradient: "from-blue-600 to-cyan-500",
        inStock: true,
        featured: false,
      },
      {
        name: "Tarjetas de Regalo Apple",
        slug: "apple-gift-cards",
        description: "Aplicaciones, juegos y servicios en plataformas Apple",
        fullDescription: "Usa tarjetas de regalo de Apple para comprar aplicaciones, juegos, música, películas y más en App Store, iTunes y Apple Music. Código instantáneo.",
        categoryId: tecnologiaId,
        image: "/images/product-category-amazon.png",
        gradient: "from-gray-700 to-gray-500",
        inStock: true,
        featured: false,
      },
    ];

    for (const prod of productData) {
      const result = await db.insert(products).values(prod);
      const productId = Number(result.insertId);

      // Add amounts for each product
      const amounts = [
        { amount: "$10", price: "10.00" },
        { amount: "$25", price: "25.00" },
        { amount: "$50", price: "50.00" },
        { amount: "$100", price: "100.00" },
      ];

      for (const amt of amounts) {
        await db.insert(productAmounts).values({
          productId,
          amount: amt.amount,
          price: amt.price,
        });
      }
    }

    // Create FAQs
    console.log("Creating FAQs...");
    const faqData = [
      {
        question: "¿Cómo recibo mi tarjeta de regalo?",
        answer: "Una vez completada tu compra a través de WhatsApp, recibirás tu código de tarjeta de regalo instantáneamente en el mismo chat. El proceso toma menos de 5 minutos.",
        order: 1,
        published: true,
      },
      {
        question: "¿Cuánto tiempo tengo para usar mi tarjeta de regalo?",
        answer: "Las tarjetas de regalo no tienen fecha de vencimiento. Puedes usarlas cuando quieras, sin preocuparte por perder tu saldo.",
        order: 2,
        published: true,
      },
      {
        question: "¿Puedo devolver o cambiar una tarjeta de regalo?",
        answer: "Debido a la naturaleza digital de nuestros productos, no aceptamos devoluciones una vez que el código ha sido entregado. Sin embargo, si hay algún problema con tu código, contáctanos inmediatamente y lo resolveremos.",
        order: 3,
        published: true,
      },
      {
        question: "¿Los códigos funcionan en mi país?",
        answer: "La mayoría de nuestras tarjetas de regalo funcionan internacionalmente. Sin embargo, algunas tienen restricciones regionales. Verifica la descripción del producto o pregúntanos por WhatsApp antes de comprar.",
        order: 4,
        published: true,
      },
      {
        question: "¿Cómo realizo el pago?",
        answer: "Aceptamos pagos a través de WhatsApp. Una vez que selecciones tu producto, nuestro equipo te guiará a través del proceso de pago seguro. Aceptamos transferencias bancarias, PayPal y otros métodos locales.",
        order: 5,
        published: true,
      },
      {
        question: "¿Qué hago si mi código no funciona?",
        answer: "Si tienes problemas para canjear tu código, contáctanos inmediatamente por WhatsApp con una captura de pantalla del error. Nuestro equipo de soporte te ayudará a resolver el problema o te proporcionará un reemplazo.",
        order: 6,
        published: true,
      },
    ];

    for (const faq of faqData) {
      await db.insert(faqs).values(faq);
    }

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
