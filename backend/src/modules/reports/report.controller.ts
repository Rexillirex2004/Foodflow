import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/apiError";
import { reportRangeQuerySchema, salesQuerySchema, topItemsQuerySchema } from "./report.validation";
import * as reportService from "./report.service";

function requireUser(req: Request) {
  if (!req.user) throw ApiError.unauthorized();
  return req.user;
}

export const getSummaryHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const query = reportRangeQuerySchema.parse(req.query);
  res.json(await reportService.getSummary(user.restaurantId, query));
});

export const getSalesHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const { groupBy, ...range } = salesQuerySchema.parse(req.query);
  res.json(await reportService.getSalesSeries(user.restaurantId, range, groupBy));
});

export const getTopItemsHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const { limit, ...range } = topItemsQuerySchema.parse(req.query);
  res.json(await reportService.getTopItems(user.restaurantId, range, limit));
});
