import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";
import { CreateTableInput, UpdateTableInput } from "./table.validation";
import { TableStatus } from "../../types/enums";

export function listTables(restaurantId: string) {
  return prisma.table.findMany({ where: { restaurantId }, orderBy: { name: "asc" } });
}

export function createTable(restaurantId: string, input: CreateTableInput) {
  return prisma.table.create({ data: { restaurantId, ...input } });
}

async function findOwned(restaurantId: string, id: string) {
  const table = await prisma.table.findFirst({ where: { id, restaurantId } });
  if (!table) throw ApiError.notFound("Mesa no encontrada");
  return table;
}

export async function updateTable(restaurantId: string, id: string, input: UpdateTableInput) {
  await findOwned(restaurantId, id);
  return prisma.table.update({ where: { id }, data: input });
}

export async function updateTableStatus(restaurantId: string, id: string, status: TableStatus) {
  await findOwned(restaurantId, id);
  return prisma.table.update({ where: { id }, data: { status } });
}

export async function deleteTable(restaurantId: string, id: string) {
  await findOwned(restaurantId, id);
  await prisma.table.delete({ where: { id } });
}
