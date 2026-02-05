export const jwtSecret = process.env.JWT_SECRET! as string;
export const OTP_EXPIRE_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES ?? 10);
export const OTP_RESEND_INTERVAL_MINUTES = Number(
  process.env.OTP_RESEND_INTERVAL_MINUTES ?? 5,
);
export const BACKEND_URL = process.env.BACKEND_URL!;
export const FRONTEND_URL = process.env.FRONTEND_URL!;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
