import { Request, Response } from "express";
import { Expense } from "../generated/prisma/client";
import Prisma from "../lib/prisma";
import { json } from "node:stream/consumers";

interface createExpenseRequest {
  expense: Expense;
}

interface updateExpenseRequest {
  expense: Expense;
}

export const createExpense = async (
  req: Request<{}, {}, createExpenseRequest>,
  res: Response,
) => {
  try {
    const expense: Expense = req.body.expense;

    if (
      expense == null ||
      !expense.amount ||
      !expense.categoryId ||
      !expense.title
    ) {
      return res.status(400).json({
        message: "Required data missing.",
      });
    }

    const category = await Prisma.category.findFirst({
      where: {
        id: expense.categoryId,
        userId: req.user!.id,
      },
    });

    if (!category) {
      return res.status(500).json({
        message: "Category doesn't belong to the user.",
      });
    }

    expense.userId = req.user!.id;

    const newExpense = await Prisma.expense.create({
      data: expense,
    });

    return res.status(200).json({
      message: "Expense added successfully.",
      expense: newExpense,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error while adding the expense. Try again later.",
    });
  }
};

export const updateExpense = async (
  req: Request<{ id: string }, {}, updateExpenseRequest>,
  res: Response,
) => {
  try {
    const expense = req.body.expense;

    if (!req.params.id) {
      return res.status(400).json({
        message: "Expense not provided.",
      });
    }

    if (!expense || !expense.amount || !expense.categoryId || !expense.title) {
      return res.status(400).json({
        message: "Required data missing.",
      });
    }

    const updatedExpense = await Prisma.expense.update({
      where: { id: Number(req.params.id) },
      data: expense,
    });

    return res.status(200).json({
      message: "Expense updated successfully.",
      expense: updatedExpense,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating the expense. Try again later.",
    });
  }
};

export const deleteExpense = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({
        message: "Expense not provided.",
      });
    }

    await Prisma.expense.delete({
      where: { id: Number(req.params.id) },
    });

    return res.status(400).json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating the expense. Try again later.",
    });
  }
};

export const getExpensesForUser = async (req: Request, res: Response) => {
  try {
    const expenses = await Prisma.expense.findMany({
      where: { userId: req.user!.id },
    });

    return res.status(200).json({
      message: "Expenses fetched successfully.",
      expenses,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching all the expenses. Try again later.",
    });
  }
};

export const getExpensesForCategory = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
) => {
  try {
    const expenses = await Prisma.expense.findMany({
      where: { userId: req.user!.id, categoryId: Number(req.params.id) },
    });

    return res.status(200).json({
      message: "Expenses fetched successfully.",
      expenses,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Error fetching all the expenses for the category. Try again later.",
    });
  }
};
