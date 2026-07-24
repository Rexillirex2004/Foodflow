import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
  CreateItemInput,
  UpdateItemInput,
} from "./menu.validation";

export function listCategories(restaurantId: string) {
  return prisma.menuCategory.findMany({ where: { restaurantId }, orderBy: { sortOrder: "asc" } });
}

export function createCategory(restaurantId: string, input: CreateCategoryInput) {
  return prisma.menuCategory.create({ data: { restaurantId, ...input } });
}

async function findOwnedCategory(restaurantId: string, id: string) {
  const category = await prisma.menuCategory.findFirst({ where: { id, restaurantId } });
  if (!category) throw ApiError.notFound("Categoría no encontrada");
  return category;
}

export async function updateCategory(restaurantId: string, id: string, input: UpdateCategoryInput) {
  await findOwnedCategory(restaurantId, id);
  return prisma.menuCategory.update({ where: { id }, data: input });
}

export async function deleteCategory(restaurantId: string, id: string) {
  await findOwnedCategory(restaurantId, id);
  const itemCount = await prisma.menuItem.count({ where: { categoryId: id } });
  if (itemCount > 0) {
    throw ApiError.conflict("No se puede eliminar una categoría que tiene platos asociados");
  }
  await prisma.menuCategory.delete({ where: { id } });
}

export function listItems(restaurantId: string, categoryId?: string) {
  return prisma.menuItem.findMany({
    where: { restaurantId, ...(categoryId ? { categoryId } : {}) },
    orderBy: { name: "asc" },
  });
}

export async function createItem(restaurantId: string, input: CreateItemInput) {
  await findOwnedCategory(restaurantId, input.categoryId);
  return prisma.menuItem.create({ data: { restaurantId, ...input } });
}

async function findOwnedItem(restaurantId: string, id: string) {
  const item = await prisma.menuItem.findFirst({ where: { id, restaurantId } });
  if (!item) throw ApiError.notFound("Plato no encontrado");
  return item;
}

export async function updateItem(restaurantId: string, id: string, input: UpdateItemInput) {
  await findOwnedItem(restaurantId, id);
  if (input.categoryId) {
    await findOwnedCategory(restaurantId, input.categoryId);
  }
  return prisma.menuItem.update({ where: { id }, data: input });
}

export async function setAvailability(restaurantId: string, id: string, available: boolean) {
  await findOwnedItem(restaurantId, id);
  return prisma.menuItem.update({ where: { id }, data: { available } });
}

export async function deleteItem(restaurantId: string, id: string) {
  await findOwnedItem(restaurantId, id);
  await prisma.menuItem.delete({ where: { id } });
}
