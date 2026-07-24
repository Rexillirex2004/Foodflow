import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/apiError";
import {
  createCategorySchema,
  updateCategorySchema,
  createItemSchema,
  updateItemSchema,
  toggleAvailabilitySchema,
} from "./menu.validation";
import * as menuService from "./menu.service";

function requireUser(req: Request) {
  if (!req.user) throw ApiError.unauthorized();
  return req.user;
}

export const listCategoriesHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  res.json(await menuService.listCategories(user.restaurantId));
});

export const createCategoryHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const input = createCategorySchema.parse(req.body);
  res.status(201).json(await menuService.createCategory(user.restaurantId, input));
});

export const updateCategoryHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const input = updateCategorySchema.parse(req.body);
  res.json(await menuService.updateCategory(user.restaurantId, req.params.id, input));
});

export const deleteCategoryHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  await menuService.deleteCategory(user.restaurantId, req.params.id);
  res.status(204).send();
});

export const listItemsHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const categoryId = typeof req.query.categoryId === "string" ? req.query.categoryId : undefined;
  res.json(await menuService.listItems(user.restaurantId, categoryId));
});

export const createItemHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const input = createItemSchema.parse(req.body);
  res.status(201).json(await menuService.createItem(user.restaurantId, input));
});

export const updateItemHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const input = updateItemSchema.parse(req.body);
  res.json(await menuService.updateItem(user.restaurantId, req.params.id, input));
});

export const setAvailabilityHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const { available } = toggleAvailabilitySchema.parse(req.body);
  res.json(await menuService.setAvailability(user.restaurantId, req.params.id, available));
});

export const deleteItemHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  await menuService.deleteItem(user.restaurantId, req.params.id);
  res.status(204).send();
});
