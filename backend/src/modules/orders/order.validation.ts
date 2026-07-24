import { z } from "zod";

export const createOrderSchema = z.object({
  tableId: z.string().min(1),
  notes: z.string().optional(),
});

export const addOrderItemSchema = z.object({
  menuItemId: z.string().min(1),
  quantity: z.number().int().positive(),
  notes: z.string().optional(),
});

export const updateOrderItemSchema = z.object({
  quantity: z.number().int().positive().optional(),
  notes: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["IN_PROGRESS", "READY", "SERVED", "CANCELLED"]),
});

export const listOrdersQuerySchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "READY", "SERVED", "CLOSED", "CANCELLED"]).optional(),
  tableId: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type AddOrderItemInput = z.infer<typeof addOrderItemSchema>;
export type UpdateOrderItemInput = z.infer<typeof updateOrderItemSchema>;
