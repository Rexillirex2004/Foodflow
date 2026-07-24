import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/jwt";
import { ApiError } from "../utils/apiError";

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return next(ApiError.unauthorized("Falta el token de autenticación"));
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, restaurantId: payload.restaurantId, role: payload.role };
    next();
  } catch {
    next(ApiError.unauthorized("Token inválido o expirado"));
  }
}
