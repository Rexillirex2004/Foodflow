import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";

export const requireActiveSubscription = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw ApiError.unauthorized();
    }

    const subscription = await prisma.subscription.findUnique({
      where: { restaurantId: req.user.restaurantId },
    });

    if (!subscription) {
      throw ApiError.subscriptionInactive(null);
    }

    const now = new Date();

    const trialUsable = subscription.status === "TRIAL" && subscription.trialEndsAt > now;
    const activeUsable =
      subscription.status === "ACTIVE" &&
      subscription.currentPeriodEnd != null &&
      subscription.currentPeriodEnd > now;

    if (trialUsable || activeUsable) {
      return next();
    }

    // La suscripción venció (o nunca se activó) y sigue marcada como TRIAL/ACTIVE:
    // la degradamos a EXPIRED para reflejar el estado real.
    if (subscription.status === "TRIAL" || subscription.status === "ACTIVE") {
      await prisma.subscription.update({
        where: { restaurantId: req.user.restaurantId },
        data: { status: "EXPIRED" },
      });
    }

    throw ApiError.subscriptionInactive(subscription);
  }
);
