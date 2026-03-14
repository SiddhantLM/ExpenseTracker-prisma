import express from "express";
import { isAuth } from "../middleware/auth";
import {
  createExpense,
  deleteExpense,
  getExpensesForCategory,
  getExpensesForUser,
  updateExpense,
} from "../controllers/expense";

const router = express.Router();

router.post("/", isAuth, createExpense);
router.put("/:id", isAuth, updateExpense);
router.delete("/:id", isAuth, deleteExpense);
router.get("/", isAuth, getExpensesForUser);
router.get("/category/:id", isAuth, getExpensesForCategory);

export default router;
