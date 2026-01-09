import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.js';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set');
  process.exit(1);
}

console.log('🔗 Connecting to database...');

const connection = await mysql.createConnection(DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

console.log('✅ Connected to database');

// Crear categorías primero
console.log('\n📁 Creating categories...');

const categories = [
  { name: 'Videojuegos', slug: 'videojuegos', description: 'Tarjetas de regalo para videojuegos' },
  { name: 'Compras', slug: 'compras', description: 'Tarjetas de regalo para compras en línea' },
  { name: 'Tecnología', slug: 'tecnologia', description: 'Tarjetas de regalo para tecnología' },
];

const insertedCategories = {};

for (const category of categories) {
  const [result] = await connection.execute(
    'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)',
    [category.name, category.slug, category.description]
  );
  insertedCategories[category.slug] = result.insertId;
  console.log(`✅ Category created: ${category.name} (ID: ${result.insertId})`);
}

// Crear productos
console.log('\n🎮 Creating products...');

const products = [
  {
    name: 'PlayStation Network',
    slug: 'playstation-network',
    description: 'Tarjetas PSN para juegos, complementos y suscripciones.',
    fullDescription: 'Tarjetas PlayStation Network para comprar juegos, DLC, suscripciones y más en la PlayStation Store. Compatible con PS4 y PS5.',
    categoryId: insertedCategories['videojuegos'],
    image: null,
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
    image: null,
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
    image: null,
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
    image: null,
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
    image: null,
    gradient: 'from-emerald-600 to-emerald-800',
    inStock: true,
    featured: true,
    displayOrder: 5,
  },
];

const insertedProducts = [];

for (const product of products) {
  const [result] = await connection.execute(
    `INSERT INTO products (name, slug, description, fullDescription, categoryId, image, gradient, inStock, featured, displayOrder) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)`,
    [
      product.name,
      product.slug,
      product.description,
      product.fullDescription,
      product.categoryId,
      product.image,
      product.gradient,
      product.inStock,
      product.featured,
      product.displayOrder,
    ]
  );
  insertedProducts.push({ ...product, id: result.insertId });
  console.log(`✅ Product created: ${product.name} (ID: ${result.insertId})`);
}

// Crear precios para cada producto
console.log('\n💰 Creating product amounts...');

const amounts = ['$10', '$25', '$50', '$100'];
const prices = [10.00, 25.00, 50.00, 100.00];

for (const product of insertedProducts) {
  for (let i = 0; i < amounts.length; i++) {
    await connection.execute(
      'INSERT INTO product_amounts (productId, amount, price) VALUES (?, ?, ?)',
      [product.id, amounts[i], prices[i]]
    );
    console.log(`  ✅ Amount added: ${amounts[i]} for ${product.name}`);
  }
}

// Crear FAQs
console.log('\n❓ Creating FAQs...');

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
  await connection.execute(
    'INSERT INTO faqs (question, answer, `order`, published) VALUES (?, ?, ?, ?)',
    [faq.question, faq.answer, faq.order, faq.published]
  );
  console.log(`✅ FAQ created: ${faq.question.substring(0, 50)}...`);
}

console.log('\n🎉 Data import completed successfully!');

await connection.end();
