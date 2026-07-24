import { client } from "./client";
import { ReportSummary, SalesPoint, TopItem } from "../types/models";

export function getSummary(range?: { from?: string; to?: string }) {
  return client.get<ReportSummary>("/reports/summary", { params: range }).then((r) => r.data);
}

export function getSales(range?: { from?: string; to?: string; groupBy?: "day" | "week" | "month" }) {
  return client.get<SalesPoint[]>("/reports/sales", { params: range }).then((r) => r.data);
}

export function getTopItems(range?: { from?: string; to?: string; limit?: number }) {
  return client.get<TopItem[]>("/reports/top-items", { params: range }).then((r) => r.data);
}
