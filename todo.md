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
