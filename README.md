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
- **Base de datos**: SQLite (desarrollo) + Prisma ORM — migrable a PostgreSQL cambiando solo el `provider` y `DATABASE_URL`
- **Autenticación**: JWT con control de roles

## Estructura del proyecto

```
FoodFlow/
├── backend/   # API REST (Express + Prisma)
└── mobile/    # App móvil (Expo)
```

Instrucciones de instalación y ejecución en `backend/README.md` (o sección de configuración de cada paquete) y en `mobile/`.

## Estado del proyecto

Scaffold funcional inicial: backend con autenticación, gestión de menú/mesas/pedidos/facturación/reportes y suscripción (mock), y app móvil Expo consumiendo esa API con paywall integrado.
