import { z } from "zod";

export const createInvoiceSchema = z.object({
  orderId: z.string().min(1),
  tipAmount: z.number().min(0).default(0),
  paymentMethod: z.enum(["CASH", "CARD"]),
});

export const listInvoicesQuerySchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
