import { Request, Response } from "express";
import { Expense } from "../generated/prisma/client";
import Prisma from "../lib/prisma";
import { json } from "node:stream/consumers";

interface createExpenseRequest {
  expense: Expense;
}

interface updateExpenseRequest {
  expense: Expense;
  id: number;
}

interface deleteExpenseRequest {
  id: number;
}

export const createExpense = async (
  req: Request<{}, {}, createExpenseRequest>,
  res: Response,
) => {
  try {
    const expense: Expense = req.body.expense;

    if (!expense || !expense.amount || !expense.categoryId || expense.title) {
      return res.status(400).json({
        message: "Required data missing.",
      });
    }

    const newExpense = await Prisma.expense.create({
      data: expense,
    });

    return res.status(200).json({
      message: "Expense added successfully.",
      expense: newExpense,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while adding the expense. Try again later.",
    });
  }
};

export const updateExpense = async (
  req: Request<{}, {}, updateExpenseRequest>,
  res: Response,
) => {
  try {
    const { id } = req.body;
    const expense = req.body.expense;

    if (!id) {
      return res.status(400).json({
        message: "Expense not provided.",
      });
    }

    if (!expense || !expense.amount || !expense.categoryId || expense.title) {
      return res.status(400).json({
        message: "Required data missing.",
      });
    }

    const updatedExpense = await Prisma.expense.update({
      where: { id: id },
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
  req: Request<{}, {}, deleteExpenseRequest>,
  res: Response,
) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({
        message: "Expense not provided.",
      });
    }

    await Prisma.expense.delete({
      where: { id: id },
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
