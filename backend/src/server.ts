import express, { Application, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import dbConnection from "./config/db";
import authRoutes from "./routes/auth.routes";
import leadRoutes from "./routes/lead.routes";
import userRoutes from "./routes/user.routes";
import dashboardRoutes from "./routes/dashboard.routes";

dotenv.config();

const app: Application=express();
app.use(cors({
  origin: ["http://localhost:5173", "https://smart-leads-dashboard-frontend-bm51.onrender.com"],
  credentials: true,
}));
app.use(express.json());

dbConnection();

app.get("/", (req: Request, res: Response) => {
       res.json({msg: "Server is running"})
});
app.use("/api/auth",authRoutes);
app.use("/api/leads",leadRoutes);
app.use("/api/users",userRoutes);
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT,() => {
      console.log(`Server running on port ${PORT}`);
    });

