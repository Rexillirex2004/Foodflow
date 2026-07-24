import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { requireRole } from "../../middlewares/requireRole";
import { requireActiveSubscription } from "../../middlewares/requireActiveSubscription";
import { getSummaryHandler, getSalesHandler, getTopItemsHandler } from "./report.controller";

export const reportRouter = Router();

reportRouter.use(authenticate, requireActiveSubscription, requireRole("OWNER", "ADMIN"));

reportRouter.get("/summary", getSummaryHandler);
reportRouter.get("/sales", getSalesHandler);
reportRouter.get("/top-items", getTopItemsHandler);
