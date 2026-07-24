import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/apiError";
import { createInvoiceSchema, listInvoicesQuerySchema } from "./invoice.validation";
import * as invoiceService from "./invoice.service";

function requireUser(req: Request) {
  if (!req.user) throw ApiError.unauthorized();
  return req.user;
}

export const createInvoiceHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const input = createInvoiceSchema.parse(req.body);
  res.status(201).json(await invoiceService.createInvoice(user.restaurantId, user.id, input));
});

export const listInvoicesHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const query = listInvoicesQuerySchema.parse(req.query);
  res.json(await invoiceService.listInvoices(user.restaurantId, query));
});

export const getInvoiceHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  res.json(await invoiceService.getInvoice(user.restaurantId, req.params.id));
});
