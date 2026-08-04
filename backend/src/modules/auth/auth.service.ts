import { prisma } from "../../lib/prisma";
import { hashPassword, comparePassword } from "../../lib/hash";
import { signToken } from "../../lib/jwt";
import { ApiError } from "../../utils/apiError";
import { env } from "../../config/env";
import { RegisterInput, LoginInput } from "./auth.validation";
import { Role } from "../../types/enums";

export async function register(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw ApiError.conflict("Ya existe una cuenta con ese correo");
  }

  const passwordHash = await hashPassword(input.password);
  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + env.TRIAL_DAYS);

  const restaurant = await prisma.restaurant.create({
    data: {
      name: input.restaurantName,
      users: {
        create: {
          name: input.ownerName,
          email: input.email,
          passwordHash,
          role: "OWNER",
        },
      },
      subscription: {
        create: {
          status: "TRIAL",
          trialEndsAt,
          priceCents: env.SUBSCRIPTION_PRICE_CENTS,
        },
      },
    },
    include: { users: true, subscription: true },
  });

  const owner = restaurant.users[0];
  const token = signToken({ sub: owner.id, restaurantId: restaurant.id, role: owner.role as Role });

  return { token, user: sanitizeUser(owner), restaurant: sanitizeRestaurant(restaurant), subscription: restaurant.subscription };
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    include: { restaurant: { include: { subscription: true } } },
  });

  if (!user || !user.active) {
    throw ApiError.unauthorized("Credenciales inválidas");
  }

  const valid = await comparePassword(input.password, user.passwordHash);
  if (!valid) {
    throw ApiError.unauthorized("Credenciales inválidas");
  }

  const token = signToken({ sub: user.id, restaurantId: user.restaurantId, role: user.role as Role });

  return {
    token,
    user: sanitizeUser(user),
    restaurant: sanitizeRestaurant(user.restaurant),
    subscription: user.restaurant.subscription,
  };
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { restaurant: { include: { subscription: true } } },
  });

  if (!user) {
    throw ApiError.notFound("Usuario no encontrado");
  }

  return {
    user: sanitizeUser(user),
    restaurant: sanitizeRestaurant(user.restaurant),
    subscription: user.restaurant.subscription,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sanitizeUser(user: any) {
  const { passwordHash: _passwordHash, ...rest } = user;
  return rest;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sanitizeRestaurant(restaurant: any) {
  const { users: _users, subscription: _subscription, ...rest } = restaurant;
  return rest;
}
