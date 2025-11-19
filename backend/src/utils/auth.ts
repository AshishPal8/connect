import jwt from "jsonwebtoken";
import { jwtSecret } from ".";
import type { Response } from "express";

export interface TokenPayload {
  id: number;
  email: string;
  username: string;
  isOnboarded: boolean;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, jwtSecret, {
    expiresIn: "30d",
  });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, jwtSecret) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export function setAuthCookie(res: Response, token: string): void {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: "/",
  });
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });
}
