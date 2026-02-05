import { BadRequestError, NotFoundError } from "../../utils/error";
import { generateOtp } from "../../utils/generateOtp";
import { prisma } from "../../utils/prisma";
import { OAuth2Client } from "google-auth-library";
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  jwtSecret,
  OTP_EXPIRE_MINUTES,
} from "../../utils/index";
import type {
  googleAuthInput,
  loginInput,
  registerInput,
  resendOtpInput,
  verifyOtpInput,
} from "./auth.schema";
import { getAssetUrl } from "../../utils/getAssetUrl";
import { generateToken } from "../../utils/auth";
import axios from "axios";

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

  const token = generateToken({
    id: user.id,
    email: user.email,
    username: user.username,
    isOnboarded: user.isOnboarded,
  });

  return {
    success: true,
    message: "OTP verified",
    data: {
      id: user.id,
      name: user.name,
      username: user.username,
      profilePicture: user.profilePicture,
      email: user.email,
      isVerified: user.isVerified,
      isOnboarded: user.isOnboarded,
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

  const token = generateToken({
    id: user.id,
    email: user.email,
    username: user.username,
    isOnboarded: user.isOnboarded,
  });

  return {
    success: true,
    message: "Logged in successfully",
    data: {
      id: user.id,
      name: user.name,
      username: user.username,
      profilePicture: user.profilePicture,
      email: user.email,
      isVerified: user.isVerified,
      isOnboarded: user.isOnboarded,
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

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

export const googleAuthService = async (data: googleAuthInput) => {
  const { credential } = data;

  if (!credential) {
    throw new BadRequestError("Credential is required");
  }

  // const ticket = await googleClient.verifyIdToken({
  //   idToken: credential,
  //   audience: GOOGLE_CLIENT_ID,
  // });

  const googleResponse = await axios.get(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${credential}`,
  );

  const payload = googleResponse.data;

  if (!payload) {
    throw new BadRequestError("Invalid Google credential");
  }

  const { email, name, picture, sub: googleId } = payload!;

  if (!email) {
    throw new BadRequestError("Email is required");
  }

  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    const username = email.split("@")[0];

    user = await prisma.user.create({
      data: {
        email,
        name: name || "",
        username: username || "user",
        profilePicture: picture || "",
        isVerified: true,
        isOnboarded: false,
      },
    });
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    username: user.username,
    isOnboarded: user.isOnboarded,
  });

  return {
    success: true,
    message: "User logged in successfully",
    data: {
      id: user.id,
      name: user.name,
      username: user.username,
      profilePicture: user.profilePicture,
      email: user.email,
      isVerified: user.isVerified,
      isOnboarded: user.isOnboarded,
      token,
    },
  };
};
