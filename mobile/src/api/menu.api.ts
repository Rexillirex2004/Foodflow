import { client } from "./client";
import { MenuCategory, MenuItem } from "../types/models";

export function listCategories() {
  return client.get<MenuCategory[]>("/menu/categories").then((r) => r.data);
}

export function createCategory(input: { name: string; sortOrder?: number }) {
  return client.post<MenuCategory>("/menu/categories", input).then((r) => r.data);
}

export function listItems(categoryId?: string) {
  return client
    .get<MenuItem[]>("/menu/items", { params: categoryId ? { categoryId } : undefined })
    .then((r) => r.data);
}

export function createItem(input: {
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  available?: boolean;
}) {
  return client.post<MenuItem>("/menu/items", input).then((r) => r.data);
}

export function updateItem(id: string, input: Partial<{ name: string; price: number; description: string }>) {
  return client.patch<MenuItem>(`/menu/items/${id}`, input).then((r) => r.data);
}

export function setItemAvailability(id: string, available: boolean) {
  return client.patch<MenuItem>(`/menu/items/${id}/availability`, { available }).then((r) => r.data);
}
