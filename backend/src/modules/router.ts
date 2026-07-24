import { Router } from "express";
import { authRouter } from "./auth/auth.routes";
import { subscriptionRouter } from "./subscriptions/subscription.routes";
import { userRouter } from "./users/user.routes";
import { menuRouter } from "./menu/menu.routes";
import { tableRouter } from "./tables/table.routes";
import { orderRouter } from "./orders/order.routes";
import { invoiceRouter } from "./invoices/invoice.routes";
import { reportRouter } from "./reports/report.routes";

export const router = Router();

router.use("/auth", authRouter);
router.use("/subscription", subscriptionRouter);
router.use("/users", userRouter);
router.use("/menu", menuRouter);
router.use("/tables", tableRouter);
router.use("/orders", orderRouter);
router.use("/invoices", invoiceRouter);
router.use("/reports", reportRouter);
