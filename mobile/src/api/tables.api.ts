import { client } from "./client";
import { Table, TableStatus } from "../types/models";

export function listTables() {
  return client.get<Table[]>("/tables").then((r) => r.data);
}

export function updateTableStatus(id: string, status: TableStatus) {
  return client.patch<Table>(`/tables/${id}/status`, { status }).then((r) => r.data);
}
