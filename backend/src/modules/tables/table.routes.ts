import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { requireRole } from "../../middlewares/requireRole";
import { requireActiveSubscription } from "../../middlewares/requireActiveSubscription";
import {
  listTablesHandler,
  createTableHandler,
  updateTableHandler,
  updateTableStatusHandler,
  deleteTableHandler,
} from "./table.controller";

export const tableRouter = Router();

tableRouter.use(authenticate, requireActiveSubscription);

const manage = requireRole("OWNER", "ADMIN");

tableRouter.get("/", listTablesHandler);
tableRouter.post("/", manage, createTableHandler);
tableRouter.patch("/:id", manage, updateTableHandler);
tableRouter.patch(
  "/:id/status",
  requireRole("OWNER", "ADMIN", "WAITER", "CASHIER"),
  updateTableStatusHandler
);
tableRouter.delete("/:id", manage, deleteTableHandler);
