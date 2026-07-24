import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { requireRole } from "../../middlewares/requireRole";
import { requireActiveSubscription } from "../../middlewares/requireActiveSubscription";
import {
  listUsersHandler,
  createUserHandler,
  updateUserHandler,
  deactivateUserHandler,
} from "./user.controller";

export const userRouter = Router();

userRouter.use(authenticate, requireRole("OWNER", "ADMIN"), requireActiveSubscription);

userRouter.get("/", listUsersHandler);
userRouter.post("/", createUserHandler);
userRouter.patch("/:id", updateUserHandler);
userRouter.delete("/:id", deactivateUserHandler);
