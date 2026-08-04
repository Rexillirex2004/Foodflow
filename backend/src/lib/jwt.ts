import jwt from "jsonwebtoken";
import { Role } from "../types/enums";
import { env } from "../config/env";

export interface TokenPayload {
  sub: string;
  restaurantId: string;
  role: Role;
}

export function signToken(payload: TokenPayload): string {
  const options: jwt.SignOptions = { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] };
  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
}
