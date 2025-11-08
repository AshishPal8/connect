import { Router } from "express";
import {
  checkUsernameExistsController,
  loginController,
  registerController,
  resendOtpController,
  verifyLoginController,
  verifyOtpController,
} from "./auth.controller";
import { validateRequest } from "../../middleware/validateRequest";
import {
  loginSchema,
  registerSchema,
  resendOtpSchema,
  verifyOtpSchema,
} from "./auth.schema";

const router = Router();

router.post("/check-username", checkUsernameExistsController);
router.post("/register", validateRequest(registerSchema), registerController);
router.post("/verify", validateRequest(verifyOtpSchema), verifyOtpController);
router.post("/login", validateRequest(loginSchema), loginController);
router.post(
  "/verify-login",
  validateRequest(verifyOtpSchema),
  verifyLoginController
);
router.post("/resend", validateRequest(resendOtpSchema), resendOtpController);

export default router;
