import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../utils/index.ts";
import { ForbiddenError } from "../utils/error.ts";
import { verifyToken } from "../utils/auth.ts";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  return new Promise((resolve, reject) => {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return reject();
    }

    // try {
    //   const decoded = jwt.verify(token, jwtSecret);

    //   if (typeof decoded === "string" || !("id" in decoded)) {
    //     throw new ForbiddenError("Invalid token payload");
    //   }

    //   req.user = {
    //     id: decoded.id,
    //     email: decoded.email,
    //   };

    //   next();
    //   resolve();
    // } catch (error) {
    //   res.status(400).json({ message: "Invalid or expired token" });
    //   reject();
    // }

    const decoded = verifyToken(token);
    if (!decoded) {
      throw new ForbiddenError("Invalid or expired token");
    }

    req.user = decoded;
    next();
    resolve();
  });
};
