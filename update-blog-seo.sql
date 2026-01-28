-- Actualizar metadatos SEO de todos los artículos del blog

-- Artículo: Comprar en Amazon desde Colombia
UPDATE blog_posts 
SET 
  metaTitle = 'Comprar en Amazon desde Colombia con Gift Cards (Guía 2026)',
  metaDescription = 'Aprende a comprar en Amazon USA desde Colombia sin tarjeta de crédito. Usa Amazon Gift Cards para pagar de forma segura, rápida y controlar tus gastos. ¡Guía completa!',
  metaKeywords = 'Comprar Amazon Colombia, Amazon Gift Card, pagar Amazon sin tarjeta de crédito, casillero virtual Colombia, Amazon USA desde Colombia',
  updatedAt = NOW()
WHERE slug IN ('comprar-amazon-colombia-gift-cards', 'comprar-en-amazon-desde-colombia-guia-con-amazon-gift-cards');

-- Artículo: Tarjetas PSN Colombia
UPDATE blog_posts 
SET 
  metaTitle = 'Tarjetas PSN Colombia: Guía 2026 para Comprar en PlayStation Store',
  metaDescription = 'Descubre dónde y cómo comprar Tarjetas PSN en Colombia de forma segura. Guía completa para recargar tu monedero de PlayStation Store (USA o Colombia) y comprar juegos.',
  metaKeywords = 'Tarjetas PSN Colombia, comprar PSN Colombia, PlayStation Store Colombia, recargar PSN Colombia, gift card PSN',
  updatedAt = NOW()
WHERE slug IN ('tarjetas-psn-colombia-guia-2026', 'como-comprar-tarjetas-psn-colombia-guia-completa-2026');

-- Artículo: Tarjetas Google Play
UPDATE blog_posts 
SET 
  metaTitle = 'Tarjetas Google Play Colombia: Comprar Saldo y Diamantes Free Fire',
  metaDescription = 'Guía completa para comprar y canjear Tarjetas Google Play en Colombia. Recarga tu saldo, compra apps y adquiere diamantes para Free Fire de forma segura y rápida.',
  metaKeywords = 'Tarjetas Google Play Colombia, saldo Google Play, diamantes Free Fire Colombia, recargar Google Play, gift card Google Play',
  updatedAt = NOW()
WHERE slug = 'tarjetas-google-play-colombia';

-- Artículo: Mejores Gift Cards
UPDATE blog_posts 
SET 
  metaTitle = 'Las 5 Mejores Gift Cards para Regalar en Colombia (2026)',
  metaDescription = '¿No sabes qué regalar? Descubre el Top 5 de las Gift Cards más populares y versátiles para regalar en Colombia en 2026. ¡El regalo digital perfecto!',
  metaKeywords = 'Mejores gift cards Colombia, regalos digitales, tarjetas de regalo, qué regalar en Colombia, ideas de regalo',
  updatedAt = NOW()
WHERE slug IN ('mejores-gift-cards-colombia-2026', 'las-5-mejores-tarjetas-regalo-regalar-mes');

-- Artículo: Steam Colombia
UPDATE blog_posts 
SET 
  metaTitle = 'Steam Colombia: Cómo Recargar Saldo y Aprovechar Ofertas (2026)',
  metaDescription = 'Aprende a recargar tu billetera de Steam en Colombia de forma fácil y segura con tarjetas de regalo. ¡Prepárate para las ofertas de verano e invierno!',
  metaKeywords = 'Steam Colombia, recargar Steam Colombia, Steam Wallet, tarjetas de regalo Steam, ofertas Steam',
  updatedAt = NOW()
WHERE slug IN ('steam-colombia-recargar-billetera', 'steam-colombia-guia-compra-gamers');

-- Artículo: Novedades Steam
UPDATE blog_posts 
SET 
  metaTitle = 'Novedades en Steam: Ofertas de Temporada y Cómo Recargar Saldo (2026)',
  metaDescription = '¡Prepárate para las rebajas de Steam 2026! Descubre el calendario oficial de ofertas y aprende la forma más segura de recargar saldo Steam en Colombia.',
  metaKeywords = 'Steam ofertas 2026, rebajas Steam, calendario Steam, recargar Steam Colombia, Steam Wallet',
  updatedAt = NOW()
WHERE slug = 'novedades-steam-ofertas-temporada-recargar-saldo';

-- Artículo: Netflix y Spotify
UPDATE blog_posts 
SET 
  metaTitle = 'Pagar Netflix y Spotify en Colombia sin Tarjeta de Crédito (Guía 2026)',
  metaDescription = 'Aprende a pagar tus suscripciones de Netflix y Spotify Premium en Colombia usando tarjetas de regalo. La forma más segura y fácil sin vincular tu tarjeta de crédito.',
  metaKeywords = 'Pagar Netflix Colombia, Spotify Premium sin tarjeta, tarjetas Netflix Colombia, gift card Spotify, entretenimiento digital',
  updatedAt = NOW()
WHERE slug = 'netflix-spotify-entretenimiento-sin-tarjetas-credito';

-- Artículo: Xbox Game Pass
UPDATE blog_posts 
SET 
  metaTitle = 'Tarjetas Xbox Game Pass: El Netflix de los Videojuegos en Colombia',
  metaDescription = 'Descubre por qué Xbox Game Pass es el servicio imprescindible para todo gamer en Colombia. Guía completa para comprar y activar tu suscripción sin tarjeta de crédito.',
  metaKeywords = 'Xbox Game Pass Colombia, suscripción Xbox, Game Pass Ultimate, tarjetas Xbox Colombia, Netflix videojuegos',
  updatedAt = NOW()
WHERE slug = 'tarjetas-xbox-game-pass-netflix-videojuegos-colombia';

-- Artículo: Google Play vs Apple
UPDATE blog_posts 
SET 
  metaTitle = 'Google Play vs Apple Gift Cards: ¿Cuál Elegir? (Guía Colombia 2026)',
  metaDescription = '¿Android o iOS? Descubre las diferencias clave entre las tarjetas de regalo de Google Play y Apple en Colombia. Analizamos qué puedes comprar con cada una.',
  metaKeywords = 'Google Play vs Apple, gift cards Colombia, tarjetas Google Play, Apple gift card, Android vs iOS Colombia',
  updatedAt = NOW()
WHERE slug = 'google-play-vs-apple-gift-cards-cual-elegir';

-- Artículo: Canjear Amazon
UPDATE blog_posts 
SET 
  metaTitle = 'Cómo Canjear una Tarjeta Amazon en tu Cuenta de Colombia (2026)',
  metaDescription = '¿Recibiste una Amazon Gift Card y no sabes cómo usarla? Aprende paso a paso cómo canjear tu tarjeta de regalo Amazon desde Colombia de forma fácil y segura.',
  metaKeywords = 'canjear Amazon Colombia, redeem Amazon gift card, usar tarjeta Amazon Colombia, Amazon gift card Colombia',
  updatedAt = NOW()
WHERE slug = 'como-canjear-tarjeta-amazon-cuenta-colombia';

-- Verificar actualizaciones
SELECT slug, metaTitle, LEFT(metaDescription, 80) as description_preview
FROM blog_posts 
WHERE published = 1
ORDER BY publishedAt DESC;
