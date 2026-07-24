import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/apiError";
import { createUserSchema, updateUserSchema } from "./user.validation";
import * as userService from "./user.service";

export const listUsersHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  res.json(await userService.listUsers(req.user.restaurantId));
});

export const createUserHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const input = createUserSchema.parse(req.body);
  res.status(201).json(await userService.createUser(req.user.restaurantId, input));
});

export const updateUserHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const input = updateUserSchema.parse(req.body);
  res.json(await userService.updateUser(req.user.restaurantId, req.params.id, input));
});

export const deactivateUserHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  res.json(await userService.deactivateUser(req.user.restaurantId, req.params.id));
});
