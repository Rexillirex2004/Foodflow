import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { requireRole } from "../../middlewares/requireRole";
import { requireActiveSubscription } from "../../middlewares/requireActiveSubscription";
import {
  listOrdersHandler,
  getOrderHandler,
  createOrderHandler,
  addOrderItemHandler,
  updateOrderItemHandler,
  removeOrderItemHandler,
  updateOrderStatusHandler,
} from "./order.controller";

export const orderRouter = Router();

orderRouter.use(authenticate, requireActiveSubscription);

const manageOrder = requireRole("WAITER", "OWNER", "ADMIN");
// Las transiciones válidas por rol se validan dentro del service (OPEN->IN_PROGRESS es
// del mesero, IN_PROGRESS->READY es de cocina, etc.), aquí solo se exige participar del flujo.
const touchOrder = requireRole("WAITER", "KITCHEN", "OWNER", "ADMIN");

orderRouter.get("/", listOrdersHandler);
orderRouter.get("/:id", getOrderHandler);
orderRouter.post("/", manageOrder, createOrderHandler);
orderRouter.post("/:id/items", manageOrder, addOrderItemHandler);
orderRouter.patch("/:id/items/:itemId", manageOrder, updateOrderItemHandler);
orderRouter.delete("/:id/items/:itemId", manageOrder, removeOrderItemHandler);
orderRouter.patch("/:id/status", touchOrder, updateOrderStatusHandler);
