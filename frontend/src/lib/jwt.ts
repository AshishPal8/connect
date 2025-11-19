import { jwtVerify } from "jose";
import { jwtSecret } from ".";

const secret = new TextEncoder().encode(jwtSecret);
export interface JWTPayload {
  id: string;
  email: string;
  username: string;
  isOnboarded: boolean;
}

export async function decodeToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JWTPayload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}
