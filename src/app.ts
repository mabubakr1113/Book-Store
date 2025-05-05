import express from "express";
import dotenv from "dotenv";
dotenv.config();
import adminRoutes from "./routes/admin.routes";
import transactionsRoutes from "./routes/transaction.routes";
import { adminCheck } from "./middlewares/adminAuth";

const app = express();
app.use(express.json());

app.use("/admin", adminCheck, adminRoutes);

app.use("/transactions", transactionsRoutes);

app.get("/", (req, res) => {
  res.send("App is running is running");
});

export default app;
