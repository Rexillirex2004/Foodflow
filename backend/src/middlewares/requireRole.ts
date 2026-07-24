import { NextFunction, Request, Response } from "express";
import { Role } from "../types/enums";
import { ApiError } from "../utils/apiError";

export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }

    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden());
    }

    next();
  };
}
