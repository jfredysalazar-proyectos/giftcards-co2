-- Script para insertar las 12 FAQs sobre Tarjetas PSN USA
-- Ejecutar este script en la base de datos de producción

INSERT INTO faqs (question, answer, `order`, published, createdAt, updatedAt) VALUES
('¿Qué es una Tarjeta PSN USA y para qué sirve?', 'Una Tarjeta PSN USA (o Gift Card de PlayStation Store) es un código digital prepagado que te permite agregar saldo en dólares (USD) a tu cuenta de PlayStation Network (PSN) de la región de Estados Unidos. Sirve para comprar juegos digitales para PS5 y PS4, expansiones y DLCs (contenido descargable), pases de temporada, suscripciones como PlayStation Plus (Essential, Extra, Deluxe), y películas y series en la PlayStation Store.', 1, TRUE, NOW(), NOW()),

('¿Por qué un usuario en Colombia compraría una Tarjeta PSN de USA?', 'Muchos gamers en Colombia prefieren usar la PlayStation Store de USA por varias razones: el catálogo es más amplio con juegos y ofertas que no están disponibles en la tienda de Colombia, algunos juegos se lanzan primero en la tienda de USA, los precios en dólares pueden ser más favorables especialmente durante ofertas, y la tienda de USA no cobra impuestos adicionales si usas una dirección de un estado sin impuestos sobre las ventas (como Oregón o Delaware).', 2, TRUE, NOW(), NOW()),

('¿Puedo usar una Tarjeta PSN de USA en mi cuenta de PSN de Colombia?', 'No, no es posible. Las tarjetas PSN están bloqueadas por región. Una tarjeta de USA solo funciona en una cuenta de PSN de USA. Si intentas canjearla en una cuenta colombiana, te saldrá un error.', 3, TRUE, NOW(), NOW()),

('¿Cómo sé de qué región es mi cuenta de PSN?', 'Para verificar la región de tu cuenta: 1) Inicia sesión en tu cuenta de PlayStation en un navegador, 2) Ve a Gestión de Cuentas > Información de la cuenta, 3) En la sección País/Región, verás el país de tu cuenta.', 4, TRUE, NOW(), NOW()),

('¿Puedo cambiar la región de mi cuenta de PSN?', 'No. Una vez que creas una cuenta de PlayStation, no puedes cambiar su región. Si tienes una cuenta colombiana y quieres usar la tienda de USA, necesitas crear una nueva cuenta de PSN de la región de Estados Unidos.', 5, TRUE, NOW(), NOW()),

('¿Es legal tener una cuenta de PSN de USA viviendo en Colombia?', 'Sí, es completamente legal. No hay ninguna restricción que te impida crear y usar una cuenta de otra región. Sin embargo, ten en cuenta que no podrás usar métodos de pago colombianos directamente en la tienda de USA.', 6, TRUE, NOW(), NOW()),

('¿Cómo puedo comprar en la PlayStation Store de USA desde Colombia?', 'Como no puedes usar tarjetas de crédito o débito colombianas, la forma más fácil y segura es a través de Tarjetas PSN de USA: 1) Compra una Tarjeta PSN USA en un sitio confiable como GiftCards.com.co, 2) Recibe el código digital al instante en tu correo, 3) Canjea el código en tu cuenta de PSN de USA, 4) Usa el saldo para comprar lo que quieras en la PlayStation Store.', 7, TRUE, NOW(), NOW()),

('¿Qué necesito para crear una cuenta de PSN de USA?', 'Necesitas un correo electrónico que no esté asociado a otra cuenta de PSN, y una dirección de Estados Unidos. Puedes usar una dirección de un estado sin impuestos sobre las ventas, como: Estado: Oregón (OR), Ciudad: Portland, Código Postal: 97201.', 8, TRUE, NOW(), NOW()),

('¿El código de la tarjeta tiene fecha de vencimiento?', 'No. Los códigos de las Tarjetas PSN no tienen fecha de vencimiento. Puedes canjearlos cuando quieras. Sin embargo, una vez canjeado, el saldo se agrega a tu monedero y queda sujeto a los términos de servicio de Sony.', 9, TRUE, NOW(), NOW()),

('Si compro un juego con mi cuenta de USA, ¿puedo jugarlo en mi cuenta de Colombia?', 'Sí. Esta es una de las grandes ventajas. En tu consola (PS4 o PS5), activa tu cuenta de USA como principal. En PS5: Ve a Configuración > Usuarios y cuentas > Otros > Uso compartido de consola y juego offline y selecciona Activar. En PS4: Ve a Configuración > Administración de cuentas > Activar como tu PS4 principal y selecciona Activar. Luego compra y descarga el juego con tu cuenta de USA, cambia a tu cuenta de Colombia, y el juego estará disponible para jugar con tu progreso, trofeos y amigos de tu cuenta principal colombiana.', 10, TRUE, NOW(), NOW()),

('¿Los DLCs que compre con la cuenta de USA funcionarán con un juego que compré en Colombia?', 'No, generalmente no. Los juegos y los DLCs deben ser de la misma región para ser compatibles. Si compraste el juego físico en Colombia (Región ALL o LATAM), el DLC de la tienda de USA no funcionará. Recomendación: Compra siempre el juego y sus DLCs en la misma tienda regional.', 11, TRUE, NOW(), NOW()),

('Ingresé el código y me dice que no es válido. ¿Qué hago?', 'Verifica estos puntos: 1) Región: Asegúrate de que estás canjeando el código en una cuenta de PSN de Estados Unidos, 2) Tipeo: Revisa que hayas ingresado los 12 dígitos correctamente, sin guiones, 3) Estado de PSN: Comprueba si hay algún problema con los servicios de PlayStation en status.playstation.com, 4) Soporte: Si todo lo anterior está correcto, contacta al soporte de la tienda donde compraste la tarjeta.', 12, TRUE, NOW(), NOW());
