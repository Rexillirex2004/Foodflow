import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";
import { env } from "../../config/env";

export async function getSubscription(restaurantId: string) {
  const subscription = await prisma.subscription.findUnique({ where: { restaurantId } });
  if (!subscription) {
    throw ApiError.notFound("Suscripción no encontrada");
  }
  return subscription;
}

export async function payMock(restaurantId: string) {
  const now = new Date();
  const currentPeriodEnd = new Date();
  currentPeriodEnd.setDate(currentPeriodEnd.getDate() + env.SUBSCRIPTION_PERIOD_DAYS);

  return prisma.subscription.update({
    where: { restaurantId },
    data: {
      status: "ACTIVE",
      currentPeriodEnd,
      lastPaymentAt: now,
      priceCents: env.SUBSCRIPTION_PRICE_CENTS,
    },
  });
}
