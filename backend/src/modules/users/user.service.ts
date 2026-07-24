import { prisma } from "../../lib/prisma";
import { hashPassword } from "../../lib/hash";
import { ApiError } from "../../utils/apiError";
import { CreateUserInput, UpdateUserInput } from "./user.validation";

function sanitize<T extends { passwordHash?: string }>(user: T) {
  const { passwordHash: _passwordHash, ...rest } = user;
  return rest;
}

export async function listUsers(restaurantId: string) {
  const users = await prisma.user.findMany({ where: { restaurantId }, orderBy: { createdAt: "asc" } });
  return users.map(sanitize);
}

export async function createUser(restaurantId: string, input: CreateUserInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw ApiError.conflict("Ya existe una cuenta con ese correo");
  }

  const passwordHash = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: { restaurantId, name: input.name, email: input.email, role: input.role, passwordHash },
  });

  return sanitize(user);
}

async function findOwned(restaurantId: string, id: string) {
  const user = await prisma.user.findFirst({ where: { id, restaurantId } });
  if (!user) {
    throw ApiError.notFound("Usuario no encontrado");
  }
  return user;
}

export async function updateUser(restaurantId: string, id: string, input: UpdateUserInput) {
  await findOwned(restaurantId, id);
  const user = await prisma.user.update({ where: { id }, data: input });
  return sanitize(user);
}

export async function deactivateUser(restaurantId: string, id: string) {
  await findOwned(restaurantId, id);
  const user = await prisma.user.update({ where: { id }, data: { active: false } });
  return sanitize(user);
}
