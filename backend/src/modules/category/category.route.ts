import { Router } from "express";
import {
  getCategoryController,
  interestByCategoryController,
  seedCategoryController,
} from "./category.controller";
import { authMiddleware } from "../../middleware/authMiddleware";
import { validateRequest } from "../../middleware/validateRequest";
import { interestByCategorySchema } from "./category.schema";

const router = Router();

router.get("/", authMiddleware, getCategoryController);
router.post("/interests", authMiddleware, interestByCategoryController);
router.post("/seed", seedCategoryController);

export default router;
