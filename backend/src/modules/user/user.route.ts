import { Router } from "express";
import {
  getUserByUsernameController,
  getUserController,
  updateUserController,
} from "./user.controller";
import { authMiddleware } from "../../middleware/authMiddleware";
import { validateRequest } from "../../middleware/validateRequest";
import { updateUserSchema } from "./user.schema";

const router = Router();

router.put(
  "/update",
  authMiddleware,
  validateRequest(updateUserSchema),
  updateUserController,
);
router.get("/get/:username", getUserByUsernameController);
router.get("/me", authMiddleware, getUserController);

export default router;
