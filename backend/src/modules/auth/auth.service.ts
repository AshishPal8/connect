import { BadRequestError, NotFoundError } from "../../utils/error";
import { generateOtp } from "../../utils/generateOtp";
import { prisma } from "../../utils/prisma";
import jwt from "jsonwebtoken";
import { jwtSecret, OTP_EXPIRE_MINUTES } from "../../utils/index";
import type {
  loginInput,
  registerInput,
  resendOtpInput,
  verifyOtpInput,
} from "./auth.schema";
import { getAssetUrl } from "../../utils/getAssetUrl";

//check username exists
export const checkUsernameExistsService = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });

  return {
    success: true,
    exists: Boolean(user),
  };
};

//register
export const registerService = async (data: registerInput) => {
  const { username, name, email } = data;
  if (!email) {
    throw new BadRequestError("Email is required");
  }
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    throw new BadRequestError("User already exists");
  }

  const defualtImage = getAssetUrl("profile/default.jpg");

  const user = await prisma.user.create({
    data: { username, name, email, profilePicture: defualtImage },
  });

  const code = generateOtp();

  await prisma.otp.create({
    data: {
      email,
      code,
      expiresAt: new Date(Date.now() + OTP_EXPIRE_MINUTES * 60_000),
    },
  });

  return {
    success: true,
    message: "OTP sent to email",
    data: {
      id: user.id,
      code,
      email,
    },
  };
};

//verify otp
export const verifyOtpService = async (data: verifyOtpInput) => {
  const { email, code } = data;
  if (!email || !code) {
    throw new BadRequestError("Email and OTP are required");
  }
  const existingOtp = await prisma.otp.findFirst({
    where: { email, used: false, expiresAt: { gt: new Date() } },
  });
  if (!existingOtp) {
    throw new BadRequestError("OTP not found, expired or already used");
  }
  if (existingOtp.code !== code) {
    throw new BadRequestError("Invalid OTP");
  }

  await prisma.otp.update({
    where: { id: existingOtp.id },
    data: { used: true },
  });

  const user = await prisma.user.update({
    where: { email },
    data: { isVerified: true },
  });
  const token = jwt.sign({ id: user.id, email }, jwtSecret, {
    expiresIn: "30d",
  });

  return {
    success: true,
    message: "OTP verified",
    data: {
      id: user.id,
      name: user.name,
      profilePicture: user.profilePicture,
      email: user.email,
      isVerified: user.isVerified,
      token,
    },
  };
};

//login
export const loginService = async (data: loginInput) => {
  const { email } = data;
  if (!email) {
    throw new BadRequestError("Email is required");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (!existingUser) {
    throw new BadRequestError("User not found");
  }

  const code = generateOtp();

  await prisma.otp.create({
    data: {
      email,
      code,
      expiresAt: new Date(Date.now() + OTP_EXPIRE_MINUTES * 60_000),
    },
  });

  return {
    success: true,
    message: "OTP sent to email",
    data: {
      id: existingUser.id,
      code,
      email,
    },
  };
};

//verify login otp
export const verifyLoginOtpService = async (data: verifyOtpInput) => {
  const { email, code } = data;
  if (!email || !code) {
    throw new BadRequestError("Email or OTP are required");
  }
  const existingOtp = await prisma.otp.findFirst({
    where: {
      email,
      used: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });
  if (!existingOtp) {
    throw new BadRequestError("OTP not found, expired or already used");
  }
  if (existingOtp.code !== code) {
    throw new BadRequestError("Invalid OTP");
  }

  await prisma.otp.update({
    where: { id: existingOtp.id },
    data: { used: true },
  });

  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    throw new NotFoundError("User not fount!");
  }

  const token = jwt.sign({ id: user.id, email }, jwtSecret, {
    expiresIn: "30d",
  });

  return {
    success: true,
    message: "Logged in successfully",
    data: {
      id: user.id,
      name: user.name,
      profilePicture: user.profilePicture,
      email: user.email,
      isVerified: user.isVerified,
      token,
    },
  };
};

//resend otp
export const resendOtpService = async (data: resendOtpInput) => {
  const { email } = data;

  if (!email) {
    throw new BadRequestError("Email is required");
  }

  const latest = await prisma.otp.findFirst({
    where: { email },
    orderBy: { createdAt: "desc" },
  });

  if (latest) {
    throw new BadRequestError("Wait some time to get new code");
  }

  const code = generateOtp();
  const expiresAt = new Date(Date.now() + OTP_EXPIRE_MINUTES * 60_000);

  await prisma.otp.create({
    data: {
      email,
      code,
      expiresAt,
    },
  });

  try {
    // await sendOtpEmail(email, code, { expiresAt });
  } catch (err) {
    // logger.error({ err, email }, "Failed to send resent OTP")
    throw new Error("Failed to send OTP");
  }

  return {
    success: true,
    message: "OTP verified",
    data: {
      code,
    },
  };
};
