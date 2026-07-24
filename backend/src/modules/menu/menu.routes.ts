import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { requireRole } from "../../middlewares/requireRole";
import { requireActiveSubscription } from "../../middlewares/requireActiveSubscription";
import {
  listCategoriesHandler,
  createCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
  listItemsHandler,
  createItemHandler,
  updateItemHandler,
  setAvailabilityHandler,
  deleteItemHandler,
} from "./menu.controller";

export const menuRouter = Router();

menuRouter.use(authenticate, requireActiveSubscription);

const manage = requireRole("OWNER", "ADMIN");

menuRouter.get("/categories", listCategoriesHandler);
menuRouter.post("/categories", manage, createCategoryHandler);
menuRouter.patch("/categories/:id", manage, updateCategoryHandler);
menuRouter.delete("/categories/:id", manage, deleteCategoryHandler);

menuRouter.get("/items", listItemsHandler);
menuRouter.post("/items", manage, createItemHandler);
menuRouter.patch("/items/:id", manage, updateItemHandler);
menuRouter.patch(
  "/items/:id/availability",
  requireRole("OWNER", "ADMIN", "WAITER", "KITCHEN"),
  setAvailabilityHandler
);
menuRouter.delete("/items/:id", manage, deleteItemHandler);
