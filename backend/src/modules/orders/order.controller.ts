import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/apiError";
import {
  createOrderSchema,
  addOrderItemSchema,
  updateOrderItemSchema,
  updateOrderStatusSchema,
  listOrdersQuerySchema,
} from "./order.validation";
import * as orderService from "./order.service";

function requireUser(req: Request) {
  if (!req.user) throw ApiError.unauthorized();
  return req.user;
}

export const listOrdersHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const query = listOrdersQuerySchema.parse(req.query);
  res.json(await orderService.listOrders(user.restaurantId, query));
});

export const getOrderHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  res.json(await orderService.getOrder(user.restaurantId, req.params.id));
});

export const createOrderHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const input = createOrderSchema.parse(req.body);
  res.status(201).json(await orderService.createOrder(user.restaurantId, user.id, input));
});

export const addOrderItemHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const input = addOrderItemSchema.parse(req.body);
  res.status(201).json(await orderService.addOrderItem(user.restaurantId, req.params.id, input));
});

export const updateOrderItemHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const input = updateOrderItemSchema.parse(req.body);
  res.json(await orderService.updateOrderItem(user.restaurantId, req.params.id, req.params.itemId, input));
});

export const removeOrderItemHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  res.json(await orderService.removeOrderItem(user.restaurantId, req.params.id, req.params.itemId));
});

export const updateOrderStatusHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const { status } = updateOrderStatusSchema.parse(req.body);
  res.json(await orderService.updateOrderStatus(user.restaurantId, req.params.id, user.role, status));
});
