import { BadRequestError, NotFoundError } from "../../utils/error";
import { prisma } from "../../utils/prisma";
import type { interestByCategoryInput } from "./category.schema";

export const getCategoryService = async () => {
  const categories = await prisma.category.findMany();

  if (!categories || categories.length === 0) {
    return {
      success: true,
      message: "No cateogory found",
      data: [],
    };
  }

  return {
    success: true,
    message: "Category fetched successfully",
    data: categories,
  };
};

export const interestByCategoryService = async (
  data: interestByCategoryInput
) => {
  const { categoryIds } = data;

  const existingCategories = await prisma.category.findMany({
    where: { id: { in: categoryIds } },
    select: { id: true, title: true },
  });

  if (existingCategories.length !== categoryIds.length) {
    throw new BadRequestError("One or more category IDs are invalid");
  }

  const interests = await prisma.interest.findMany({
    where: { categoryId: { in: categoryIds } },
    select: {
      id: true,
      title: true,
      slug: true,
      categoryId: true,
    },
    orderBy: { title: "asc" },
  });

  return {
    success: true,
    message: "Interests fetched successfully",
    data: interests,
  };
};
