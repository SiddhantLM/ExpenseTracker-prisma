import express from "express";
import { isAuth } from "../middleware/auth";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../controllers/expenseCategory";

const router = express.Router();

router.post("/", isAuth, createCategory);
router.put("/:id", isAuth, updateCategory);
router.delete("/:id", isAuth, deleteCategory);
router.get("/", isAuth, getAllCategories);

export default router;
