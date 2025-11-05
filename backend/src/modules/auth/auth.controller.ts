import type { NextFunction, Request, Response } from "express";
import {
  loginService,
  registerService,
  resendOtpService,
  verifyLoginOtpService,
  verifyOtpService,
} from "./auth.service";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log("hello there");
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

    res.cookie("token", user.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

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

    res.cookie("token", user.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

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
