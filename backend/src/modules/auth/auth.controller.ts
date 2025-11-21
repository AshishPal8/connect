import type { NextFunction, Request, Response } from "express";
import {
  checkUsernameExistsService,
  loginService,
  registerService,
  resendOtpService,
  verifyLoginOtpService,
  verifyOtpService,
} from "./auth.service";
import { BadRequestError } from "../../utils/error";
import { clearAuthCookie, setAuthCookie } from "../../utils/auth";

export const checkUsernameExistsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const username = req.query.u as string;

    if (!username) {
      throw new BadRequestError("Username is required!");
    }
    const user = await checkUsernameExistsService(username);

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await registerService(req.body);

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const verifyOtpController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await verifyOtpService(req.body);

    setAuthCookie(res, user.data.token);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await loginService(req.body);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const verifyLoginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await verifyLoginOtpService(req.body);

    setAuthCookie(res, user.data.token);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const resendOtpController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const otp = await resendOtpService(req.body);

    res.status(200).json(otp);
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    clearAuthCookie(res);

    res.status(200).json({ message: "Logout successful!" });
  } catch (error) {
    next(error);
  }
};
