import { Router } from "express";
import { getUserController, updateUserController } from "./user.controller";
import { authMiddleware } from "../../middleware/authMiddleware";
import { validateRequest } from "../../middleware/validateRequest";
import { updateUserSchema } from "./user.schema";

const router = Router();

router.get("/me", authMiddleware, getUserController);
router.put(
  "/update",
  authMiddleware,
  validateRequest(updateUserSchema),
  updateUserController
);

export default router;
