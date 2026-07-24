import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { requireRole } from "../../middlewares/requireRole";
import { requireActiveSubscription } from "../../middlewares/requireActiveSubscription";
import { createInvoiceHandler, listInvoicesHandler, getInvoiceHandler } from "./invoice.controller";

export const invoiceRouter = Router();

invoiceRouter.use(
  authenticate,
  requireActiveSubscription,
  requireRole("CASHIER", "OWNER", "ADMIN")
);

invoiceRouter.post("/", createInvoiceHandler);
invoiceRouter.get("/", listInvoicesHandler);
invoiceRouter.get("/:id", getInvoiceHandler);
