import { z } from "zod";

export const reportRangeQuerySchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

export const salesQuerySchema = reportRangeQuerySchema.extend({
  groupBy: z.enum(["day", "week", "month"]).default("day"),
});

export const topItemsQuerySchema = reportRangeQuerySchema.extend({
  limit: z.coerce.number().int().positive().max(50).default(10),
});
