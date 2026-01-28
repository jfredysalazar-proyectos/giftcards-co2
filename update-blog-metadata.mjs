import { getDb } from './server/db.ts';
import { blogPosts } from './drizzle/schema.js';
import { eq } from 'drizzle-orm';

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

async function updateBlogMetadata() {
  try {
    console.log('🔄 Iniciando actualización de metadatos del blog...\n');
    
    const db = await getDb();
    if (!db) {
      console.error('❌ No se pudo conectar a la base de datos.');
      process.exit(1);
    }
    
    let updated = 0;
    let notFound = 0;
    
    for (const update of metadataUpdates) {
      try {
        // Verificar si el artículo existe
        const existing = await db.select()
          .from(blogPosts)
          .where(eq(blogPosts.slug, update.slug))
          .limit(1);
        
        if (existing.length === 0) {
          console.log(`⚠️  Artículo no encontrado: ${update.slug}`);
          notFound++;
          continue;
        }
        
        // Actualizar metadatos
        await db.update(blogPosts)
          .set({
            metaTitle: update.metaTitle,
            metaDescription: update.metaDescription,
            metaKeywords: update.metaKeywords,
            updatedAt: new Date()
          })
          .where(eq(blogPosts.slug, update.slug));
        
        console.log(`✅ Actualizado: ${update.slug}`);
        console.log(`   Título: ${update.metaTitle}`);
        console.log(`   Descripción: ${update.metaDescription.substring(0, 80)}...`);
        console.log('');
        updated++;
      } catch (error) {
        console.error(`❌ Error actualizando ${update.slug}:`, error.message);
      }
    }
    
    console.log('\n📊 Resumen:');
    console.log(`   ✅ Artículos actualizados: ${updated}`);
    console.log(`   ⚠️  Artículos no encontrados: ${notFound}`);
    console.log(`   📝 Total procesados: ${metadataUpdates.length}`);
    console.log('\n✨ ¡Actualización completada!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fatal:', error.message);
    process.exit(1);
  }
}

updateBlogMetadata();
