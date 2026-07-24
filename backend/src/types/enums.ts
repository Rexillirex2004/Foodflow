// SQLite no soporta enums nativos de Prisma, así que estos campos se guardan
// como String en la base de datos. Estos tipos son la fuente de verdad en
// TypeScript y las validaciones Zod de cada módulo los refuerzan en runtime.

export type Role = "OWNER" | "ADMIN" | "WAITER" | "CASHIER" | "KITCHEN";

export type SubscriptionStatus = "TRIAL" | "ACTIVE" | "EXPIRED" | "CANCELED";

export type TableStatus = "FREE" | "OCCUPIED" | "PENDING_PAYMENT";

export type OrderStatus = "OPEN" | "IN_PROGRESS" | "READY" | "SERVED" | "CLOSED" | "CANCELLED";

export type PaymentMethod = "CASH" | "CARD";
