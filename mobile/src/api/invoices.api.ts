import { client } from "./client";
import { Invoice, PaymentMethod } from "../types/models";

export function listInvoices(filters?: { from?: string; to?: string }) {
  return client.get<Invoice[]>("/invoices", { params: filters }).then((r) => r.data);
}

export function createInvoice(input: { orderId: string; tipAmount: number; paymentMethod: PaymentMethod }) {
  return client.post<Invoice>("/invoices", input).then((r) => r.data);
}
