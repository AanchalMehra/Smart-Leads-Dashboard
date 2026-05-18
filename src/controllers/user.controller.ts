import User from "../models/User";
import { AuthRequest } from "../middleware/auth.middleware";
import { Response } from "express";


//GET ALL SALES USERS
//GET
export const getAllUsers = async(req: AuthRequest, res: Response)
:Promise<void>=> {
  try {
    // get all users but never send passwords
    const users = await User.find().select("-password").lean();

    if (users.length === 0) {
      res.status(404).json({ message: "No users found" });
      return;
    }
    res.status(200).json({
      data: users,
      total: users.length,
    })

  } 
  catch (error: unknown) {
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Error occurred",
    })
  }
};