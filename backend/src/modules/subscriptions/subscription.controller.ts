import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/apiError";
import * as subscriptionService from "./subscription.service";

export const getSubscriptionHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const subscription = await subscriptionService.getSubscription(req.user.restaurantId);
  res.json(subscription);
});

export const payMockHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const subscription = await subscriptionService.payMock(req.user.restaurantId);
  res.json(subscription);
});
