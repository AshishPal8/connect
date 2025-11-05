import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
});

export const verifyOtpSchema = z.object({
  email: z.email(),
  code: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.email(),
});

export const resendOtpSchema = z.object({
  email: z.email(),
});

export type registerInput = z.infer<typeof registerSchema>;
export type verifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type loginInput = z.infer<typeof loginSchema>;
export type resendOtpInput = z.infer<typeof resendOtpSchema>;
