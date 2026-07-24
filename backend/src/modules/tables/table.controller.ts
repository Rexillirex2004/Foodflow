import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/apiError";
import { createTableSchema, updateTableSchema, updateTableStatusSchema } from "./table.validation";
import * as tableService from "./table.service";

function requireUser(req: Request) {
  if (!req.user) throw ApiError.unauthorized();
  return req.user;
}

export const listTablesHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  res.json(await tableService.listTables(user.restaurantId));
});

export const createTableHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const input = createTableSchema.parse(req.body);
  res.status(201).json(await tableService.createTable(user.restaurantId, input));
});

export const updateTableHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const input = updateTableSchema.parse(req.body);
  res.json(await tableService.updateTable(user.restaurantId, req.params.id, input));
});

export const updateTableStatusHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const { status } = updateTableStatusSchema.parse(req.body);
  res.json(await tableService.updateTableStatus(user.restaurantId, req.params.id, status));
});

export const deleteTableHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  await tableService.deleteTable(user.restaurantId, req.params.id);
  res.status(204).send();
});
