import type { SocialType } from "../../generated/prisma";
import { getRandomAvatarUrl } from "../../utils/avatar";
import { BadRequestError, NotFoundError } from "../../utils/error";
import { prisma } from "../../utils/prisma";
import type { updateUserInput } from "./user.schema";

//by id
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

//by username
export const getUserByUsernameService = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
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

//update user
export const updateUserService = async (
  userId: number,
  data: updateUserInput
) => {
  const {
    name,
    phone,
    profilePicture,
    dob,
    gender,
    isOnboarded,
    bio,
    interests,
    socials,
  } = data;

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

    if (socials && socials.length) {
      const normalized = socials
        .map((s) => ({
          type: s.type.trim().toUpperCase() as SocialType,
          url: s.url.trim(),
        }))
        .filter(
          (s, i, arr) =>
            s.type && s.url && arr.findIndex((a) => a.type === s.type) === i
        );

      const types: SocialType[] = normalized.map((s) => s.type);
      if (types.length > 0) {
        await tx.socials.deleteMany({
          where: {
            userId,
            type: { notIn: types },
          },
        });

        for (const s of normalized) {
          await tx.socials.upsert({
            where: {
              userId_type: {
                userId,
                type: s.type,
              },
            },
            update: {
              url: s.url,
            },
            create: {
              userId,
              type: s.type,
              url: s.url,
            },
          });
        }
      } else {
        await tx.socials.deleteMany({ where: { userId } });
      }
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
    if (typeof isOnboarded != "undefined") toUpdate.isOnboarded = isOnboarded;
    toUpdate.updatedAt = new Date();

    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: toUpdate,
      include: {
        UserInterest: { include: { interest: true } },
        Socials: true,
      },
    });

    return updatedUser;
  });

  const formattedUser = {
    id: user.id,
    name: user.name,
    interests: user.UserInterest.map((ui) => ({
      id: ui.interest.id,
      title: ui.interest.title,
      slug: ui.interest.slug,
    })),
    socials: user.Socials.map((s) => ({
      id: s.id,
      type: s.type,
      url: s.url,
    })),
    createdAt: user.createdAt,
  };

  return {
    success: true,
    message: "user updated successfully",
    data: formattedUser,
  };
};
