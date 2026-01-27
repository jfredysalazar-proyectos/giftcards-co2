-- Optimización de descripciones para SEO
-- Enfocado en palabras clave: tarjeta PSN Colombia, PlayStation Store Colombia, tarjeta PSN USA

-- PlayStation Network
UPDATE products 
SET 
    name = 'Tarjeta PlayStation Network (PSN) Colombia',
    description = 'Compra tarjetas PSN Colombia y USA con entrega inmediata. Ideal para PlayStation Store Colombia, PS4 y PS5.',
    fullDescription = 'Obtén tu tarjeta PlayStation Network (PSN) para la PlayStation Store Colombia o USA. Compra juegos, complementos y suscripciones de forma segura y rápida. Ofrecemos códigos PSN originales con entrega instantánea por WhatsApp. Si buscas tarjetas PSN USA desde Colombia, esta es tu mejor opción para acceder al catálogo completo de Estados Unidos.'
WHERE slug = 'playstation-network';

-- Amazon
UPDATE products 
SET 
    name = 'Amazon Gift Cards Colombia',
    description = 'Tarjetas de regalo Amazon para compras globales desde Colombia. Entrega digital instantánea.',
    fullDescription = 'Compra Amazon Gift Cards en Colombia y accede a millones de productos en la tienda más grande del mundo. Ideales para compras internacionales, suscripciones y regalos. Recibe tu código digital de Amazon al instante y empieza a comprar hoy mismo.'
WHERE slug = 'amazon-gift-cards';

-- Xbox
UPDATE products 
SET 
    name = 'Xbox Gift Card Colombia',
    description = 'Tarjetas de regalo Xbox para juegos y contenido digital en Microsoft Store Colombia.',
    fullDescription = 'Potencia tu experiencia de juego con la Xbox Gift Card Colombia. Canjea códigos para juegos, aplicaciones y películas en la Microsoft Store. Entrega rápida y segura para usuarios de Xbox en todo el territorio colombiano.'
WHERE slug = 'xbox-gift-card';

-- Nintendo
UPDATE products 
SET 
    name = 'Nintendo eShop Card Colombia',
    description = 'Tarjetas Nintendo eShop para Switch. Compra juegos digitales de Nintendo en Colombia.',
    fullDescription = 'La forma más fácil de comprar juegos para tu Nintendo Switch. Con la Nintendo eShop Card Colombia, obtén acceso inmediato a los mejores títulos de Mario, Zelda y más. Entrega digital garantizada al instante.'
WHERE slug = 'nintendo-eshop';
