import { Response, Request } from "express";
import Prisma from "../lib/prisma";

interface createCategoryRequest {
  title: string;
  description?: string;
}

interface updateCategoryRequest {
  title: string;
  description: string;
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
  req: Request<{ id: string }, {}, updateCategoryRequest>,
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
      where: { id: Number(req.params.id) },
    });

    if (!existingCategory) {
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

    if (
      existingCategoryTitle &&
      existingCategoryTitle.id !== existingCategory.id
    ) {
      return res.status(400).json({
        message: "Category already present.",
      });
    }

    const category = await Prisma.category.update({
      where: {
        id: Number(req.params.id),
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
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const existingCategory = await Prisma.category.findFirst({
      where: { id: Number(req.params.id) },
    });

    if (!existingCategory) {
      return res.status(400).json({
        message: "Category not found.",
      });
    }

    await Prisma.category.delete({
      where: {
        id: Number(req.params.id),
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

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Prisma.category.findMany({
      where: { userId: req.user!.id },
    });

    return res.status(200).json({
      message: "Fetched the categories successfully.",
      categories,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while fetching the categories.",
    });
  }
};
