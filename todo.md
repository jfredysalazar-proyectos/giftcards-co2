# Giftcards.Co - Lista de Tareas

## Características Completadas
- [x] Diseño inicial del marketplace con gradientes vibrantes
- [x] Grid de productos con categorías
- [x] Carrito de compras con modal
- [x] Integración WhatsApp para checkout
- [x] Carrusel de creadores
- [x] Footer con enlaces
- [x] Traducción completa al español
- [x] Actualización a full-stack con base de datos y autenticación

## Características Pendientes
- [x] Resolver conflictos de merge en Home.tsx
- [x] Crear esquema de base de datos para productos, pedidos y reseñas
- [x] Crear query helpers en server/db.ts
- [x] Crear routers tRPC para productos, categorías, pedidos, reseñas y FAQs
- [x] Conectar frontend con backend mediante tRPC
- [ ] Resolver problemas de conectividad de base de datos y ejecutar migraciones
- [ ] Ejecutar script de seed para poblar datos iniciales
- [ ] Implementar sistema de autenticación con Login y Registro
- [ ] Crear página de detalle de producto con integración tRPC
- [ ] Crear Back Office para gestión de productos
- [ ] Crear Back Office para gestión de pedidos
- [ ] Crear Back Office para gestión de usuarios
- [ ] Implementar sistema de reseñas dinámicas en frontend
- [ ] Crear página FAQ en español
- [ ] Integrar notificaciones por email
- [ ] Actualizar carrito para guardar en base de datos
- [ ] Implementar gestión de pedidos completa

## Nuevas Características Solicitadas
- [x] Crear panel de administración con dashboard
- [x] Implementar gestión de productos en admin (crear, editar, eliminar)
- [x] Implementar gestión de categorías en admin
- [x] Implementar gestión de pedidos en admin (actualizar estados)
- [x] Implementar gestión de reseñas en admin (aprobar, eliminar)
- [x] Implementar gestión de FAQs en admin
- [x] Crear página de detalle de producto con slug routing
- [x] Agregar selector de montos en detalle de producto
- [x] Implementar galería de imágenes en detalle de producto
- [x] Mostrar reseñas de clientes en detalle de producto
- [x] Agregar formulario de reseñas para usuarios autenticados
- [x] Integrar botón de compra directa con WhatsApp
- [x] Implementar sistema de notificaciones por email
- [x] Configurar emails de confirmación de pedido
- [x] Configurar emails de actualización de estado de pedido
- [x] Crear página FAQ en español
- [x] Integrar FAQ con base de datos dinámica

## Dashboard de Usuario
- [x] Crear página de dashboard de usuario
- [x] Implementar página "Mis Pedidos" con historial completo
- [x] Agregar visualización de códigos de regalo por pedido
- [x] Implementar rastreo de estado de pedidos en tiempo real
- [x] Agregar funcionalidad de descarga de códigos
- [x] Crear componente de tarjeta de pedido con detalles
- [x] Agregar filtros por estado de pedido
- [x] Implementar búsqueda de pedidos por ID o producto
- [x] Agregar enlace "Mis Pedidos" en navegación principal

## Productos Faltantes
- [x] Agregar producto Nintendo eShop a categoría Videojuegos
- [x] Agregar producto Xbox Game Pass a categoría Videojuegos
- [x] Agregar producto Amazon Gift Cards a categoría Compras
- [x] Agregar montos ($10, $25, $50, $100) para cada producto nuevo
- [x] Insertar productos en base de datos con SQL
- [ ] Verificar que todos los productos se muestren correctamente cuando la base de datos se estabilice

## Nuevo Producto Solicitado
- [ ] Agregar producto Xbox Gift Card a categoría Videojuegos
- [ ] Agregar montos disponibles para Xbox Gift Card
- [ ] Verificar que el producto se muestre correctamente en el frontend

## Error de Autenticación
- [x] Investigar y resolver error 404 en inicio de sesión
- [x] Corregir enlaces de login para usar getLoginUrl() en lugar de /login
- [x] Actualizar Home.tsx con enlaces correctos de OAuth
- [ ] Probar flujo completo de login con usuario

## Error OAuth Callback
- [ ] Investigar error "OAuth: callback failed"
- [ ] Revisar logs del servidor para detalles del error
- [ ] Verificar configuración de OAuth en server/_core
- [ ] Comprobar variables de entorno relacionadas con OAuth
- [ ] Probar flujo de autenticación completo

## Botón Crear Nuevo Producto
- [x] Investigar por qué el botón "Crear Nuevo Producto" no funciona
- [x] Revisar componente ProductsManagement.tsx
- [x] Corregir manejo de estado del diálogo con handleNewProduct
- [x] Actualizar Dialog para usar setIsDialogOpen correctamente
- [x] Verificar que el diálogo de crear producto se abra correctamente
- [x] Probar funcionalidad completa de creación de productos

## Gestión de Montos por Producto
- [x] Agregar tabla de montos dentro del formulario de producto en Admin
- [x] Permitir agregar múltiples montos ($10, $25, $50, $100, personalizado)
- [x] Implementar funcionalidad de agregar/eliminar montos dinámicamente
- [x] Implementar botones rápidos para montos preestablecidos
- [x] Agregar validación de montos antes de guardar producto
- [x] Actualizar router de productos para aceptar amounts en create y update
- [x] Actualizar createProduct en db.ts para retornar producto creado con ID
- [x] Guardar montos en base de datos asociados al producto
- [ ] Cargar montos existentes al editar producto
- [ ] Actualizar frontend para mostrar montos disponibles en detalle de producto
- [ ] Actualizar selector de montos en página de producto

## Agregar Xbox Gift Card
- [x] Generar imagen profesional para Xbox Gift Card
- [x] Insertar producto Xbox Gift Card en base de datos
- [x] Agregar montos disponibles para Xbox Gift Card ($10, $25, $50, $100)
- [x] Verificar que el producto se muestre correctamente en el frontend

## Regenerar Imágenes de Productos en Formato 1:1
- [x] Regenerar imagen de PlayStation Network en formato cuadrado 1:1
- [x] Regenerar imagen de Xbox Gift Card en formato cuadrado 1:1
- [x] Regenerar imagen de Nintendo eShop en formato cuadrado 1:1
- [x] Regenerar imagen de Amazon Gift Cards en formato cuadrado 1:1
- [x] Regenerar imagen de Xbox Game Pass en formato cuadrado 1:1
- [x] Todas las imágenes ahora son cuadradas y se verán perfectamente en móvil

## Carrusel Hero con Imágenes de Videojuegos
- [x] Generar 4 imágenes impactantes de videojuegos populares en alta resolución
- [x] Crear componente HeroCarousel con embla-carousel y autoplay
- [x] Reemplazar banner de texto estático con carrusel dinámico
- [x] Implementar transiciones suaves entre slides (autoplay cada 5 segundos)
- [x] Agregar indicadores de navegación (dots) en la parte inferior
- [x] Agregar botones de navegación izquierda/derecha
- [x] Agregar overlay de gradiente para mejor legibilidad del texto
- [x] Mantener texto superpuesto sobre el carrusel
- [x] Agregar barra de búsqueda flotante debajo del carrusel
- [x] Asegurar que el carrusel sea responsive en móvil

## Sección de Testimonios Reales
- [x] Generar 6 avatares realistas de clientes diversos
- [x] Crear componente TestimonialsCarousel con embla-carousel
- [x] Reemplazar sección de creadores destacados con testimonios
- [x] Implementar sistema de calificación con estrellas (5 estrellas)
- [x] Agregar nombres, fotos y comentarios de clientes en español
- [x] Mostrar nombre del producto comprado en cada testimonio
- [x] Agregar badge de "Cliente Verificado"
- [x] Implementar navegación del carrusel con flechas izquierda/derecha
- [x] Agregar autoplay cada 5 segundos
- [x] Mostrar estadística de calificación global (4.9/5 con 10,000+ reseñas)
- [x] Asegurar diseño responsive para móvil (1 col móvil, 2 tablet, 3 desktop)

## Sistema de Configuración de WhatsApp
- [x] Crear tabla de configuración (settings) en el esquema de base de datos
- [x] Agregar campo whatsapp_number en la tabla settings
- [x] Insertar número inicial +573334315646 en la base de datos
- [x] Crear query helpers para obtener y actualizar configuración en server/db.ts
- [x] Crear router tRPC para settings (get, getAll, update, create)
- [x] Crear componente SettingsManagement en el panel Admin
- [x] Agregar pestaña "Configuración" en el panel Admin
- [x] Actualizar todos los botones de WhatsApp en Home.tsx para usar número dinámico
- [x] Actualizar botón de WhatsApp en ProductDetail.tsx para usar número dinámico
- [x] Actualizar botón de WhatsApp en CartModal.tsx para usar número dinámico
- [x] Agregar query de settings en todos los componentes que usan WhatsApp
- [x] Usar número +573334315646 como valor por defecto
- [ ] Probar que el número se actualice correctamente desde el Admin
- [ ] Verificar que todos los enlaces de WhatsApp funcionen correctamente

## Mejora del Sistema de Carrito de Compras
- [x] Actualizar ProductDetail.tsx con dos botones: "Agregar al Carrito" y "Comprar Ahora"
- [x] Actualizar CartContext para incluir productId e image en CartItem
- [x] Mejorar CartModal para mostrar todos los productos agregados con imágenes
- [x] Implementar funcionalidad de agregar producto al carrito desde ProductDetail
- [x] Mantener funcionalidad de compra directa por WhatsApp desde ProductDetail
- [x] El CartModal ya tiene botón de checkout por WhatsApp funcional
- [x] El mensaje de WhatsApp ya muestra resumen completo de productos
- [x] Agregar toast de confirmación al agregar productos al carrito
- [x] Agregar ícono de carrito en la navegación con contador de items
- [x] Agregar CartModal en Home.tsx para mostrar el carrito
- [ ] Implementar persistencia del carrito en localStorage
- [ ] Probar flujo completo de agregar múltiples productos y comprar

## Ícono de Carrito en Página de Detalle de Producto
- [x] Agregar ícono de carrito con contador en navegación de ProductDetail.tsx
- [x] Importar CartModal en ProductDetail.tsx
- [x] Implementar funcionalidad de abrir/cerrar CartModal desde ícono de carrito
- [x] Asegurar consistencia visual con el ícono de carrito de Home.tsx

## Optimización de Imágenes a WebP
- [x] Convertir todas las imágenes existentes (productos, hero, testimonios) a formato WebP
- [x] Actualizar referencias de imágenes en base de datos
- [x] Actualizar referencias de imágenes en código frontend
- [x] Implementar sistema automático de conversión WebP en uploads del Admin
- [x] Agregar librería sharp para procesamiento de imágenes
- [x] Crear helper de conversión de imágenes en servidor
- [x] Integrar conversión automática en ProductsManagement al subir imágenes
- [x] Probar que las imágenes WebP se carguen correctamente

## Sistema de Múltiples Imágenes por Producto
- [x] Crear tabla productImages en esquema de base de datos
- [x] Agregar campos: productId, imageUrl, displayOrder, isPrimary
- [x] Ejecutar migración de base de datos con pnpm db:push
- [x] Crear query helpers para productImages en server/db.ts
- [x] Actualizar router de productos para manejar múltiples imágenes
- [x] Implementar UI de carga de imágenes en ProductsManagement (hasta 3 imágenes)
- [x] Agregar preview de imágenes con opción de eliminar
- [x] Implementar drag & drop para reordenar imágenes
- [x] Actualizar ProductDetail para mostrar galería de imágenes
- [x] Probar carga, edición y eliminación de imágenes

## Persistencia del Carrito en localStorage
- [x] Actualizar CartContext para cargar items desde localStorage al inicializar
- [x] Implementar función para guardar carrito en localStorage automáticamente
- [x] Sincronizar carrito con localStorage en cada operación (agregar, eliminar, actualizar cantidad)
- [x] Manejar casos edge: localStorage no disponible, datos corruptos
- [x] Probar persistencia del carrito al recargar página y cerrar/abrir navegador

## Páginas Legales del Footer
- [x] Crear página de Términos y Condiciones con contenido completo
- [x] Crear página de Política de Privacidad conforme a GDPR y políticas de Google
- [x] Crear página de Política de Reembolso para productos digitales
- [x] Actualizar componente Footer con enlaces funcionales
- [x] Configurar rutas en App.tsx para páginas legales
- [x] Verificar que todos los enlaces del footer funcionen correctamente

## Páginas de Soporte del Footer
- [x] Expandir página de FAQs con preguntas frecuentes sobre productos digitales
- [x] Agregar preguntas sobre proceso de compra, entrega, canje de códigos
- [x] Agregar preguntas sobre problemas comunes y soluciones
- [x] Crear página de Contáctanos con formulario y métodos de contacto
- [x] Crear página de Centro de Ayuda con guías y recursos
- [x] Actualizar enlaces del footer de Soporte
- [x] Configurar rutas en App.tsx para nuevas páginas
- [x] Verificar que todos los enlaces funcionen correctamente

## Bug: Pérdida de Datos al Editar Productos en Admin
- [x] Agregar queries para cargar productAmounts al abrir modal de edición
- [x] Agregar queries para cargar productImages al abrir modal de edición
- [x] Actualizar handleEdit para cargar montos existentes en el estado
- [x] Actualizar handleEdit para cargar imágenes existentes en el estado
- [x] Modificar handleSubmit para no eliminar datos no modificados
- [x] Probar edición de producto con montos e imágenes existentes
- [x] Verificar que los datos persisten después de guardar

## Recuperación de Imágenes de Productos
- [x] Buscar imágenes originales PNG/JPG de PSN y Xbox en directorio
- [x] Verificar si existen backups de las imágenes originales
- [x] Regenerar imágenes de PSN y Xbox Game Pass si es necesario
- [x] Actualizar referencias en la base de datos
- [x] Verificar que las imágenes se muestren correctamente en el sitio

## Regeneración de Imagen Nintendo eShop
- [x] Generar imagen profesional de Nintendo eShop gift card
- [x] Actualizar referencia en base de datos
- [x] Verificar que la imagen se muestre correctamente en el sitio

## Bug: Imágenes se Borran al Editar Montos o Descripción
- [x] Analizar lógica de updateMutation que elimina imágenes incorrectamente
- [x] Modificar lógica para solo eliminar imágenes si el usuario las modificó explícitamente
- [x] Agregar flag o comparación para detectar cambios en imágenes
- [x] Probar edición de montos sin tocar imágenes
- [x] Probar edición de descripción sin tocar imágenes
- [x] Verificar que las imágenes persisten después de guardar

## Regeneración de Imagen Amazon Gift Card
- [x] Generar imagen impactante y profesional de Amazon Gift Card
- [x] Actualizar referencia en base de datos
- [x] Verificar que la imagen se muestre correctamente en el sitio

## Bug Persistente: Imágenes se Borran al Editar Montos (Investigación Profunda)
- [x] Analizar flujo completo: handleEdit → useEffect → handleSubmit
- [x] Verificar si useEffect está cargando correctamente las imágenes existentes
- [x] Identificar por qué productImages está vacío al guardar
- [x] Revisar si el problema está en el reseteo de productImages
- [x] Implementar solución que no dependa del estado productImages
- [x] Considerar comparar directamente con existingImages en updateMutation
- [x] Probar múltiples escenarios: editar solo montos, solo descripción, solo imágenes
- [x] Verificar que la solución funcione en todos los casos

## Reemplazo de Imagen Amazon Gift Card
- [x] Copiar imagen proporcionada por usuario al directorio del proyecto
- [x] Actualizar referencia en base de datos
- [x] Verificar que la nueva imagen se muestre correctamente

## Imágenes para Hero Carousel
- [x] Generar imagen impactante de FC 26 para hero carousel
- [x] Generar imagen impactante de Fortnite para hero carousel
- [x] Actualizar HeroCarousel.tsx con nuevas imágenes
- [x] Verificar que las imágenes se muestren correctamente en el carousel

## Barra de Anuncios Dinámica
- [x] Crear tabla announcements en esquema de base de datos
- [x] Agregar campos: id, text, isActive, backgroundColor, textColor, createdAt, updatedAt
- [x] Ejecutar migración de base de datos
- [x] Crear query helpers para announcements en server/db.ts
- [x] Crear router de announcements en server/routers/
- [x] Crear componente AnnouncementBar.tsx para mostrar anuncio
- [x] Integrar AnnouncementBar en Home.tsx
- [x] Crear interfaz de gestión en Admin para editar anuncio
- [x] Insertar anuncio inicial con TRM del día
- [x] Probar edición y visualización del anuncio

## Animación Marquee y Expansión de Barra de Anuncios
- [x] Agregar animación CSS marquee al texto de AnnouncementBar
- [x] Implementar desplazamiento horizontal continuo del texto
- [x] Integrar AnnouncementBar en ProductDetail.tsx
- [x] Integrar AnnouncementBar en todas las páginas legales (Terms, Privacy, Refund)
- [x] Integrar AnnouncementBar en páginas de soporte (Contact, HelpCenter, FAQ)
- [x] Verificar que la animación funcione correctamente en todas las páginas

## Nuevo Logo para GiftCards Colombia
- [x] Generar logo original, sencillo e impactante para GiftCards Colombia
- [x] Guardar logo en formato WebP optimizado
- [x] Actualizar logo en navegación de todas las páginas
- [x] Actualizar favicon del sitio
- [x] Cambiar nombre de marca de "Giftcards.Co" a "GiftCards Colombia"
- [x] Actualizar referencias al dominio "Giftcards.Com.co"
- [x] Verificar que el nuevo branding se vea correctamente en todas las páginas

## Actualización de Logo con Imagen del Usuario
- [x] Copiar imagen proporcionada por usuario al directorio del proyecto
- [x] Reemplazar logo-giftcards-colombia.webp con nueva imagen
- [x] Verificar que el logo se muestre correctamente en todas las páginas

## Reemplazo de Ícono GC por Logo Completo
- [x] Actualizar Home.tsx para usar imagen del logo en lugar de ícono GC
- [x] Actualizar ProductDetail.tsx para usar imagen del logo
- [x] Actualizar todas las páginas legales y de soporte
- [x] Ajustar tamaño y estilo del logo para que se vea bien
- [x] Verificar que el logo se muestre correctamente en todas las páginas
