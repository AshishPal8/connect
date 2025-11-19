import { Request } from "express";

type AuthUser = {
  id: number;
  username: string;
  email: string;
  isOnboarded: boolean;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
export {};
