import { getRandomAvatarUrl } from "../../utils/avatar";
import { BadRequestError, NotFoundError } from "../../utils/error";
import { prisma } from "../../utils/prisma";
import type { updateUserInput } from "./user.schema";

export const getUserService = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      UserInterest: {
        include: {
          interest: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new NotFoundError("User not found!");
  }

  const formattedUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    profilePicture: user.profilePicture,
    bio: user.bio,
    gender: user.gender,
    isVerified: user.isVerified,
    interests: user.UserInterest.map((ui) => ({
      id: ui.interest.id,
      title: ui.interest.title,
      slug: ui.interest.slug,
      category: {
        id: ui.interest.category.id,
        title: ui.interest.category.title,
        slug: ui.interest.category.slug,
      },
    })),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return {
    success: true,
    message: "User fetched successfully",
    data: formattedUser,
  };
};

export const updateUserService = async (
  userId: number,
  data: updateUserInput
) => {
  const { name, phone, profilePicture, dob, gender, bio, interests } = data;

  const interestIds = interests ? Array.from(new Set(interests)) : undefined;

  const user = await prisma.$transaction(async (tx) => {
    if (interestIds && interestIds.length) {
      const foundCount = await tx.interest.count({
        where: { id: { in: interestIds } },
      });
      if (foundCount !== interestIds.length) {
        throw new BadRequestError("One or more interests are invalid");
      }

      await tx.userInterest.deleteMany({ where: { userId } });
      const rows = interestIds.map((interestId) => ({ userId, interestId }));
      await tx.userInterest.createMany({ data: rows, skipDuplicates: true });
    }

    const toUpdate: any = {};
    if (typeof name !== "undefined") toUpdate.name = name;
    if (typeof phone !== "undefined") toUpdate.phone = phone;
    if (typeof profilePicture !== "undefined") {
      toUpdate.profilePicture = profilePicture || null;
    } else {
      toUpdate.profilePicture = getRandomAvatarUrl(gender as any);
    }
    if (typeof gender !== "undefined") toUpdate.gender = gender;
    if (typeof dob !== "undefined") toUpdate.dob = dob;
    if (typeof bio !== "undefined") toUpdate.bio = bio;
    toUpdate.updatedAt = new Date();

    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: toUpdate,
      include: {
        UserInterest: { include: { interest: true } },
      },
    });

    return updatedUser;
  });

  const formattedUser = {
    id: user.id,
    interests: user.UserInterest.map((ui) => ({
      id: ui.interest.id,
      title: ui.interest.title,
      slug: ui.interest.slug,
    })),
    createdAt: user.createdAt,
  };

  return {
    success: true,
    message: "user updated successfully",
    data: formattedUser,
  };
};
