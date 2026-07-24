import { Role } from "./enums";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        restaurantId: string;
        role: Role;
      };
    }
  }
}

export {};
