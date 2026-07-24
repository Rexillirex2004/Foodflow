import { client } from "./client";
import { Order, OrderStatus } from "../types/models";

export function listOrders(filters?: { status?: OrderStatus; tableId?: string }) {
  return client.get<Order[]>("/orders", { params: filters }).then((r) => r.data);
}

export function getOrder(id: string) {
  return client.get<Order>(`/orders/${id}`).then((r) => r.data);
}

export function createOrder(tableId: string, notes?: string) {
  return client.post<Order>("/orders", { tableId, notes }).then((r) => r.data);
}

export function addOrderItem(orderId: string, input: { menuItemId: string; quantity: number; notes?: string }) {
  return client.post<Order>(`/orders/${orderId}/items`, input).then((r) => r.data);
}

export function removeOrderItem(orderId: string, itemId: string) {
  return client.delete<Order>(`/orders/${orderId}/items/${itemId}`).then((r) => r.data);
}

export function updateOrderStatus(orderId: string, status: OrderStatus) {
  return client.patch<Order>(`/orders/${orderId}/status`, { status }).then((r) => r.data);
}
