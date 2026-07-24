import { z } from "zod";

export const createTableSchema = z.object({
  name: z.string().min(1),
  capacity: z.number().int().positive().optional(),
});

export const updateTableSchema = z.object({
  name: z.string().min(1).optional(),
  capacity: z.number().int().positive().optional(),
});

export const updateTableStatusSchema = z.object({
  status: z.enum(["FREE", "OCCUPIED", "PENDING_PAYMENT"]),
});

export type CreateTableInput = z.infer<typeof createTableSchema>;
export type UpdateTableInput = z.infer<typeof updateTableSchema>;
