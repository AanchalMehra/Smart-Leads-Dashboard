import User from "../models/User";
import { AuthRequest } from "../middleware/auth.middleware";
import { Response } from "express";


//GET ALL SALES USERS
//GET

export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = "1", limit = "10" } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const users = await User.find()
      .skip(skip)
      .limit(limitNum)
      .select("-password"); // important

    const total = await User.countDocuments();

    res.status(200).json({
      data: users,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Error occurred",
    });
  }
};