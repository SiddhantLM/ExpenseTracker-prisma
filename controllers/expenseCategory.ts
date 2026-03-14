import { Response, Request } from "express";
import Prisma from "../lib/prisma";

interface createCategoryRequest {
  title: string;
  description?: string;
}

interface updateCategoryRequest {
  id: number;
  title: string;
  description: string;
}

interface deleteCategoryRequest {
  id: number;
}

export const createCategory = async (
  req: Request<{}, {}, createCategoryRequest>,
  res: Response,
) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Title is required.",
      });
    }

    const existingCategory = await Prisma.category.findUnique({
      where: {
        title_userId: {
          title: title,
          userId: req.user!.id,
        },
      },
    });

    if (existingCategory) {
      return res.status(400).json({
        message: "Category already exists.",
      });
    }

    const category = await Prisma.category.create({
      data: {
        title: title,
        description: description ?? "",
        userId: req.user!.id,
      },
    });

    return res.status(200).json({
      message: "Category created successfully.",
      category,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while creating the category.",
    });
  }
};

export const updateCategory = async (
  req: Request<{}, {}, updateCategoryRequest>,
  res: Response,
) => {
  try {
    const { title, description, id } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Title is required.",
      });
    }

    const existingCategory = await Prisma.category.findUnique({
      where: { id: id },
    });

    if (existingCategory) {
      return res.status(400).json({
        message: "Category not found.",
      });
    }

    const existingCategoryTitle = await Prisma.category.findUnique({
      where: {
        title_userId: {
          title: title,
          userId: req.user!.id,
        },
      },
    });

    if (existingCategory) {
      return res.status(400).json({
        message: "Category not found.",
      });
    }

    const category = await Prisma.category.update({
      where: {
        id: id,
      },
      data: {
        title: title,
        description: description ?? "",
      },
    });

    return res.status(200).json({
      message: "Category updated successfully.",
      category,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while creating the category.",
    });
  }
};

export const deleteCategory = async (
  req: Request<{}, {}, deleteCategoryRequest>,
  res: Response,
) => {
  try {
    const { id } = req.body;

    const existingCategory = await Prisma.category.findFirst({
      where: { id: id },
    });

    if (!existingCategory) {
      return res.status(400).json({
        message: "Category not found.",
      });
    }

    await Prisma.category.delete({
      where: {
        id: id,
      },
    });

    return res.status(200).json({
      message: "Category deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while creating the category.",
    });
  }
};
