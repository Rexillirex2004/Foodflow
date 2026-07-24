export type Role = "OWNER" | "ADMIN" | "WAITER" | "CASHIER" | "KITCHEN";

export type SubscriptionStatus = "TRIAL" | "ACTIVE" | "EXPIRED" | "CANCELED";

export type TableStatus = "FREE" | "OCCUPIED" | "PENDING_PAYMENT";

export type OrderStatus = "OPEN" | "IN_PROGRESS" | "READY" | "SERVED" | "CLOSED" | "CANCELLED";

export type PaymentMethod = "CASH" | "CARD";

export interface User {
  id: string;
  restaurantId: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  address?: string | null;
  phone?: string | null;
  taxRate: number;
}

export interface Subscription {
  id: string;
  restaurantId: string;
  status: SubscriptionStatus;
  planName: string;
  priceCents: number;
  trialEndsAt: string;
  currentPeriodEnd: string | null;
  lastPaymentAt: string | null;
}

export interface MenuCategory {
  id: string;
  restaurantId: string;
  name: string;
  sortOrder: number;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  available: boolean;
}

export interface Table {
  id: string;
  restaurantId: string;
  name: string;
  capacity?: number | null;
  status: TableStatus;
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  unitPrice: number;
  notes?: string | null;
}

export interface Order {
  id: string;
  restaurantId: string;
  tableId: string;
  table: Table;
  waiterId: string;
  waiter: { id: string; name: string };
  status: OrderStatus;
  notes?: string | null;
  items: OrderItem[];
  createdAt: string;
}

export interface Invoice {
  id: string;
  restaurantId: string;
  orderId: string;
  order: Order;
  invoiceNumber: number;
  cashierId: string;
  cashier: { id: string; name: string };
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  tipAmount: number;
  total: number;
  paymentMethod: PaymentMethod;
  createdAt: string;
}

export interface ReportSummary {
  totalRevenue: number;
  invoiceCount: number;
  averageTicket: number;
}

export interface SalesPoint {
  period: string;
  revenue: number;
  invoiceCount: number;
}

export interface TopItem {
  menuItemId: string;
  name: string;
  quantity: number;
  revenue: number;
}
