import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { requireRole } from "../../middlewares/requireRole";
import { getSubscriptionHandler, payMockHandler } from "./subscription.controller";

export const subscriptionRouter = Router();

// Nunca gateado por requireActiveSubscription: es la vía de escape del paywall.
subscriptionRouter.get("/", authenticate, getSubscriptionHandler);
subscriptionRouter.post("/pay", authenticate, requireRole("OWNER", "ADMIN"), payMockHandler);
