import express from "express";
import cors from "cors";
import { requstLogger } from "./utils/logger";
import { globalErrorHandler } from "./utils/error";

import authRoutes from "./modules/auth/auth.route";
import categoryRoutes from "./modules/category/category.route";
import userRoutes from "./modules/user/user.route";
import path from "path";

export const app = express();

app.use(express.json());
app.use(
  "/assets",
  express.static(path.join(__dirname, "../assets"), {
    maxAge: "7d",
    etag: true,
  })
);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(requstLogger);

app.get("/health", (req, res) => {
  res.json({ success: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/user", userRoutes);

app.use(globalErrorHandler);
