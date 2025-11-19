import type { NextFunction, Request, Response } from "express";
import {
  getUserByUsernameService,
  getUserService,
  updateUserService,
} from "./user.service";
import { BadRequestError, UnauthorizedError } from "../../utils/error";

export const getUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    console.log("User Id", userId);
    if (!userId) {
      throw new UnauthorizedError("Unauthorized");
    }
    const user = await getUserService(userId);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUserByUsernameController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const username = req.params?.username;
    if (!username) {
      throw new BadRequestError("username is required!");
    }
    const user = await getUserByUsernameService(username);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
export const updateUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedError("Unauthorized");
    }
    const user = await updateUserService(userId, req.body);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
