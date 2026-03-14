import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import categoryRoutes from "./routes/expenseCategory.js";
import expenseRoutes from "./routes/expense.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/expense", expenseRoutes);
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
