import jwt from "jsonwebtoken";
import { Role } from "../types/enums";
import { env } from "../config/env";

export interface TokenPayload {
  sub: string;
  restaurantId: string;
  role: Role;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
}
