import express, { Application, Request, Response } from "express";
import monogoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app: Application =express();
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
       res.json({msg: "Server is running"})
});
const PORT = process.env.PORT || 5000;
app.listen(() => {
      console.log(`Server running on port ${PORT}`);
    });

