# FoodFlow

Sistema de gestión para restaurantes pequeños y medianos. El objetivo es simplificar el trabajo diario de estos negocios, reemplazando procesos manuales (papel, hojas de cálculo, cálculos a mano) por una plataforma moderna e intuitiva que centraliza el menú, los pedidos, la facturación, las ventas y los reportes del negocio.

## Objetivo

Permitir que un restaurante pequeño o mediano administre su operación completa desde una sola app: qué vende, qué se pidió, cuánto se facturó y cómo le está yendo al negocio, sin depender de procesos manuales propensos a errores.

## Público objetivo

Dueños, administradores, meseros y cajeros de restaurantes pequeños y medianos que hoy gestionan su operación de forma manual o con herramientas dispersas (cuadernos, Excel, WhatsApp).

## Funcionalidades

### Núcleo (MVP)

- **Gestión de menú**: categorías, platos, precios, fotos, disponibilidad (activar/desactivar un plato agotado).
- **Mesas y pedidos**: mapa de mesas con estado (libre/ocupada/por cobrar), toma de pedidos por mesero, envío del pedido a cocina.
- **Facturación**: generación de factura a partir del pedido, cálculo de impuestos y propina, métodos de pago (efectivo/tarjeta), envío o impresión del comprobante.
- **Control de ventas**: historial de transacciones, cierre de caja por turno/día.
- **Reportes**: ventas por período (día/semana/mes), platos más vendidos, ingresos totales, ticket promedio.
- **Usuarios y roles**: administrador, mesero, cajero, cocina — cada uno con permisos distintos dentro de la app.

### Extras recomendados (si el tiempo del proyecto lo permite)

- **Inventario básico**: stock de ingredientes y alertas de bajo inventario.
- **KDS (Kitchen Display System)**: pantalla en cocina que reemplaza la comanda de papel, muestra pedidos en tiempo real.
- **Modo offline**: la app sigue funcionando sin internet y sincroniza al recuperar conexión (clave en locales con wifi inestable).
- **Notificaciones**: aviso al mesero cuando un pedido está listo en cocina.
- **Multi-sucursal**: si el restaurante tiene más de un local, ver reportes consolidados o por sede.
- **Dashboard con gráficos**: visualización de ventas y tendencias para el dueño, pensado para revisar el negocio de un vistazo.

## Modelo de negocio / Monetización

FoodFlow monetiza mediante **suscripción**: cada restaurante registrado paga un plan mensual único que da acceso a todas las funciones núcleo de la app (menú, mesas, pedidos, facturación, ventas y reportes).

- **Período de prueba (trial)**: al registrarse, el restaurante obtiene 14 días de acceso completo sin pagar, para poder probar la plataforma antes de comprometerse.
- **Plan único**: un solo precio mensual, todo incluido — sin niveles ni funciones bloqueadas dentro del plan, para simplificar la decisión de compra de un restaurante pequeño.
- **Pago simulado (versión académica)**: en esta versión del proyecto el cobro se simula (mock) — no se integra una pasarela de pago real. El botón "Pagar ahora" activa/renueva la suscripción directamente en la base de datos. En una versión de producción real, este paso se reemplazaría por una pasarela como Stripe.
- **Paywall**: si la suscripción vence (termina el trial o pasa la fecha de renovación) y no se renueva, la app bloquea el acceso a las funciones núcleo y solo permite ver el estado de la suscripción y pagar, hasta que se reactive.

## Stack tecnológico

- **App móvil**: React Native (Expo) + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **Base de datos**: PostgreSQL (Railway) + Prisma ORM
- **Autenticación**: JWT con control de roles

## Escalabilidad

FoodFlow está construido como una aplicación **multi-tenant**: todas las tablas del negocio (usuarios, menú, mesas, pedidos, facturas, suscripción) están asociadas a un `restaurantId`, y cada restaurante solo puede ver y modificar sus propios datos. Esto permite atender a miles de restaurantes distintos sobre la misma base de datos y el mismo backend, sin necesidad de infraestructura separada por cliente.

Puntos concretos que sostienen esa escalabilidad:

- **Backend sin estado (stateless)**: la autenticación es por JWT, no por sesiones en memoria. Esto permite correr varias instancias del backend en paralelo detrás de un balanceador de carga sin compartir estado entre ellas — escalar horizontalmente es solo levantar más instancias.
- **Aislamiento por tenant a nivel de datos**: cada tabla relevante tiene un índice sobre `restaurantId`, lo que mantiene rápidas las consultas de un restaurante puntual aunque la tabla completa crezca a millones de filas entre todos los restaurantes.
- **Base de datos con ruta de crecimiento clara**: hoy corre en PostgreSQL administrado (Railway). El siguiente escalón, si el tráfico lo exige, es mover a una instancia dedicada con réplicas de lectura para reportes (que son las consultas más pesadas) sin tocar la lógica de la aplicación, ya que todo el acceso a datos pasa por Prisma.
- **Cliente móvil sin costo marginal de infraestructura**: al ser una app Expo/React Native, cada instalación nueva no implica levantar más servidores — el costo escala con las llamadas a la API, no con el número de dispositivos instalados.
- **Módulos desacoplados**: menú, mesas/pedidos, facturación, reportes y suscripción son módulos independientes dentro del backend (rutas, validación y servicios separados), lo que permite en el futuro extraer alguno a un servicio propio (por ejemplo reportes, si se vuelve pesado) sin reescribir el resto del sistema.

## Proyección de crecimiento

Como referencia para dimensionar el negocio (cifras ilustrativas, no un compromiso comercial):

| Etapa | Restaurantes registrados | Horizonte |
|---|---|---|
| Piloto | 10 – 50 | Mes 1 – 3 |
| Tracción inicial | 500 | Año 1 |
| Expansión regional | 2,500 | Año 2 |
| Consolidación | 10,000 | Año 3 – 4 |

El crecimiento de un SaaS B2B para restaurantes independientes suele ser gradual (venta y adopción local, boca a boca, alianzas con proveedores del sector), por lo que llegar a 10,000 restaurantes registrados es una meta de mediano plazo (años), no de meses, salvo que se invierta fuertemente en ventas/marketing.

## Rentabilidad estimada a 10,000 restaurantes registrados

Usando el modelo de negocio ya definido (`SUBSCRIPTION_PRICE_CENTS = 2999`, es decir **$29.99/mes por restaurante**, con 14 días de prueba gratis): no todo restaurante *registrado* paga — algunos siguen en trial, otros nunca convierten y otros cancelan. Por eso el cálculo se hace sobre dos escenarios de conversión de trial a plan pago, un supuesto habitual en SaaS B2B para pymes:

| Escenario | Conversión a pago | Restaurantes pagando | MRR (ingreso mensual) | ARR (ingreso anual) |
|---|---|---|---|---|
| Conservador | 20% | 2,000 | 2,000 × $29.99 = **$59,980** | **≈ $719,760** |
| Optimista | 35% | 3,500 | 3,500 × $29.99 = **$104,965** | **≈ $1,259,580** |

**Costos estimados a esta escala** (infraestructura, no incluye equipo humano):

- Base de datos (Postgres administrado, dimensionado para 10,000 restaurantes): ~$150 – 400/mes.
- Backend (varias instancias detrás de balanceador, dado que es stateless): ~$150 – 400/mes.
- Servicios auxiliares (monitoreo, backups, correo transaccional, CDN): ~$100 – 200/mes.
- **Total infraestructura estimado: ~$400 – 1,000/mes.**

Incluso en el escenario conservador ($59,980/mes de ingreso), el costo de infraestructura representa **menos del 2% del ingreso mensual** — un margen bruto típico de software (>95%) antes de costos de equipo (soporte, ventas, desarrollo), que en este modelo son el gasto dominante, no la infraestructura. Esto confirma que el modelo de suscripción única y plana es viable técnica y financieramente al escalar, siempre que el costo de adquisición de cada restaurante (marketing/ventas) se mantenga razonable frente a los $29.99/mes que deja cada cliente activo.

## Estructura del proyecto

```
FoodFlow/
├── backend/   # API REST (Express + Prisma)
└── mobile/    # App móvil (Expo)
```

Instrucciones de instalación y ejecución en `backend/README.md` (o sección de configuración de cada paquete) y en `mobile/`.

## Estado del proyecto

Scaffold funcional inicial: backend con autenticación, gestión de menú/mesas/pedidos/facturación/reportes y suscripción (mock), y app móvil Expo consumiendo esa API con paywall integrado.
