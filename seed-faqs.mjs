import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './drizzle/schema.js';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const client = postgres(connectionString);
const db = drizzle(client, { schema });

const faqs = [
  {
    question: "¿Cómo funciona la compra de tarjetas de regalo digitales?",
    answer: "El proceso es muy simple: selecciona el producto que deseas, elige la denominación, agrégalo al carrito y completa el pago. Una vez confirmado el pago, recibirás tu código digital instantáneamente por correo electrónico o WhatsApp. El código puede ser canjeado inmediatamente en la plataforma correspondiente (PlayStation, Xbox, Nintendo, Amazon, etc.).",
    category: "Compra",
    displayOrder: 1
  },
  {
    question: "¿Cuánto tiempo tarda en llegar mi código después de la compra?",
    answer: "La mayoría de los códigos se entregan instantáneamente después de confirmar el pago. En algunos casos excepcionales, la entrega puede tardar hasta 24 horas. Si no recibes tu código dentro de este tiempo, verifica tu carpeta de spam o contáctanos directamente por WhatsApp al +57 333 431 5646.",
    category: "Entrega",
    displayOrder: 2
  },
  {
    question: "¿Los códigos tienen fecha de vencimiento?",
    answer: "Los códigos digitales que vendemos generalmente no tienen fecha de vencimiento, pero esto depende de las políticas del emisor original (PlayStation, Xbox, Nintendo, Amazon, etc.). Te recomendamos canjear tu código lo antes posible después de recibirlo. Consulta los términos específicos de cada plataforma para más detalles.",
    category: "Códigos",
    displayOrder: 3
  },
  {
    question: "¿Cómo canjeo mi código de PlayStation Network (PSN)?",
    answer: "Para canjear tu código PSN: 1) Inicia sesión en tu cuenta de PlayStation. 2) Ve a PlayStation Store. 3) Selecciona tu avatar en la parte superior de la pantalla. 4) Selecciona 'Canjear códigos'. 5) Ingresa cuidadosamente el código de 12 dígitos. 6) Confirma y el saldo se agregará a tu billetera PSN inmediatamente.",
    category: "Canje",
    displayOrder: 4
  },
  {
    question: "¿Cómo canjeo mi código de Xbox?",
    answer: "Para canjear tu código Xbox: 1) Presiona el botón Xbox para abrir la guía. 2) Selecciona 'Canjear código'. 3) Ingresa el código de 25 caracteres. 4) Confirma. También puedes canjearlo en xbox.com/redeemcode iniciando sesión con tu cuenta Microsoft. El saldo se agregará a tu cuenta inmediatamente.",
    category: "Canje",
    displayOrder: 5
  },
  {
    question: "¿Cómo canjeo mi código de Nintendo eShop?",
    answer: "Para canjear tu código Nintendo: 1) Selecciona Nintendo eShop en el menú HOME de tu consola. 2) Selecciona tu cuenta de usuario. 3) Selecciona 'Introducir código'. 4) Ingresa el código de 16 dígitos. 5) Confirma y los fondos se agregarán a tu saldo de Nintendo eShop inmediatamente.",
    category: "Canje",
    displayOrder: 6
  },
  {
    question: "¿Los códigos funcionan en cualquier país?",
    answer: "No todos los códigos son universales. Algunos tienen restricciones regionales impuestas por el emisor original. En la descripción de cada producto indicamos claramente para qué región es válido el código (por ejemplo, 'USA', 'Europa', 'Latinoamérica'). Asegúrate de comprar el código correcto para tu región antes de realizar la compra.",
    category: "Restricciones",
    displayOrder: 7
  },
  {
    question: "¿Puedo devolver o cambiar un código después de comprarlo?",
    answer: "Debido a la naturaleza digital de nuestros productos, generalmente no ofrecemos reembolsos una vez que el código ha sido entregado y revelado. Sin embargo, si el código es inválido, ya fue usado, o recibiste un producto incorrecto, contáctanos dentro de las 48 horas y resolveremos tu caso. Consulta nuestra Política de Reembolso para más detalles.",
    category: "Reembolsos",
    displayOrder: 8
  },
  {
    question: "Mi código no funciona, ¿qué hago?",
    answer: "Si tu código no funciona, primero verifica que: 1) Lo ingresaste correctamente (sin espacios extras). 2) Es para la región correcta de tu cuenta. 3) Tu cuenta no tiene restricciones. Si el problema persiste, contáctanos inmediatamente por WhatsApp al +57 333 431 5646 con tu número de pedido y una captura de pantalla del error. Verificaremos el código y te proporcionaremos un reemplazo si es necesario.",
    category: "Problemas",
    displayOrder: 9
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer: "Aceptamos múltiples métodos de pago para tu comodidad: tarjetas de crédito y débito (Visa, Mastercard, American Express), PayPal, transferencias bancarias y criptomonedas. Todos los pagos se procesan de forma segura a través de proveedores certificados. Tu información financiera está completamente protegida.",
    category: "Pago",
    displayOrder: 10
  },
  {
    question: "¿Es seguro comprar en Giftcards.Co?",
    answer: "Sí, tu seguridad es nuestra prioridad. Utilizamos cifrado SSL/TLS para todas las transacciones, trabajamos con procesadores de pago certificados PCI-DSS, y nunca almacenamos información completa de tarjetas de crédito. Todos nuestros códigos provienen de distribuidores autorizados oficiales. Además, cumplimos con GDPR y otras regulaciones de protección de datos.",
    category: "Seguridad",
    displayOrder: 11
  },
  {
    question: "¿Puedo comprar códigos como regalo para otra persona?",
    answer: "¡Por supuesto! Las tarjetas de regalo digitales son perfectas para regalar. Al realizar la compra, puedes proporcionar el correo electrónico o número de WhatsApp del destinatario para que reciba el código directamente. También puedes recibirlo tú y enviárselo personalmente con un mensaje personalizado.",
    category: "Regalos",
    displayOrder: 12
  },
  {
    question: "¿Ofrecen descuentos o promociones?",
    answer: "Sí, regularmente ofrecemos promociones especiales, descuentos por volumen y códigos de cupón. Suscríbete a nuestro boletín o síguenos en redes sociales para estar al tanto de nuestras ofertas exclusivas. También tenemos promociones especiales durante fechas importantes como Black Friday, Navidad y eventos de gaming.",
    category: "Promociones",
    displayOrder: 13
  },
  {
    question: "¿Puedo usar múltiples códigos en mi cuenta?",
    answer: "Sí, puedes canjear múltiples códigos en la misma cuenta. El saldo se acumulará en tu billetera digital. Sin embargo, algunas plataformas tienen límites máximos de saldo en la billetera (por ejemplo, PSN tiene un límite de $150 USD). Consulta las políticas específicas de cada plataforma para más información.",
    category: "Códigos",
    displayOrder: 14
  },
  {
    question: "¿Necesito crear una cuenta para comprar?",
    answer: "No es obligatorio crear una cuenta para realizar compras, pero te recomendamos hacerlo para disfrutar de beneficios como: historial de pedidos, recompra rápida de tus productos favoritos, acceso a ofertas exclusivas y seguimiento fácil de tus códigos. El registro es rápido, gratuito y seguro.",
    category: "Cuenta",
    displayOrder: 15
  },
  {
    question: "¿Qué hago si no recibí el correo con mi código?",
    answer: "Si no recibes el correo con tu código: 1) Verifica tu carpeta de spam o correo no deseado. 2) Confirma que proporcionaste la dirección de correo correcta. 3) Espera hasta 24 horas, ya que algunos códigos pueden tardar en procesarse. 4) Si el problema persiste, contáctanos por WhatsApp al +57 333 431 5646 con tu número de pedido y te reenviaremos el código inmediatamente.",
    category: "Entrega",
    displayOrder: 16
  },
  {
    question: "¿Los códigos de Amazon funcionan para cualquier producto?",
    answer: "Sí, los códigos de tarjeta de regalo de Amazon se pueden usar para comprar prácticamente cualquier producto vendido por Amazon o vendedores externos en la plataforma. El saldo se agrega a tu cuenta de Amazon y puedes usarlo en múltiples compras hasta agotar el saldo. No tienen fecha de vencimiento.",
    category: "Amazon",
    displayOrder: 17
  },
  {
    question: "¿Puedo comprar códigos al por mayor para mi negocio?",
    answer: "Sí, ofrecemos soluciones para empresas que desean comprar códigos digitales al por mayor. Contáctanos directamente por WhatsApp al +57 333 431 5646 o correo electrónico para discutir volúmenes, precios especiales y opciones de facturación corporativa. Trabajamos con empresas de todos los tamaños.",
    category: "Empresas",
    displayOrder: 18
  },
  {
    question: "¿Qué hago si ingresé mal mi correo electrónico al comprar?",
    answer: "Si te das cuenta inmediatamente después de la compra, contáctanos de inmediato por WhatsApp al +57 333 431 5646 con tu número de pedido y el correo electrónico correcto. Si el código aún no ha sido entregado, podemos actualizar la información. Si ya fue enviado, podemos reenviarlo a la dirección correcta después de verificar tu identidad.",
    category: "Problemas",
    displayOrder: 19
  },
  {
    question: "¿Tienen atención al cliente en español?",
    answer: "Sí, todo nuestro equipo de atención al cliente habla español de forma nativa. Estamos disponibles por WhatsApp al +57 333 431 5646 y correo electrónico en soporte@giftcards.co. Nuestro horario de atención es de lunes a viernes de 9:00 AM a 6:00 PM, pero respondemos mensajes de WhatsApp fuera de horario cuando es posible.",
    category: "Soporte",
    displayOrder: 20
  }
];

async function seed() {
  console.log('Seeding FAQs...');
  
  for (const faq of faqs) {
    await db.insert(schema.faqs).values(faq).onConflictDoNothing();
  }
  
  console.log('✅ FAQs seeded successfully!');
  await client.end();
}

seed().catch((err) => {
  console.error('Error seeding FAQs:', err);
  process.exit(1);
});
