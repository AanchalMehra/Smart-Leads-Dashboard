import { Response } from "express";
import Lead from "../models/Lead";
import { AuthRequest } from "../middleware/auth.middleware";

export const getDashboard=async(req:AuthRequest,
res:Response):Promise<void>=>{
  try {
    // SALES USERS SEE ONLY THEIR LEADS
    const query =
      req.user?.role === "sales"
        ? { createdBy: req.user.id }
        : {};

    // TOTAL LEADS
    const totalLeads =
      await Lead.countDocuments(query);

    // NEW LEADS
    const newLeads =
      await Lead.countDocuments({
        ...query,
        status: "New",
      });

    // QUALIFIED LEADS
    const qualifiedLeads =
      await Lead.countDocuments({
        ...query,
        status: "Qualified",
      });

    res.status(200).json({
      role: req.user?.role,
      user:{
        name: req.user?.name,
        email: req.user?.email}
        ,
      stats: {
        totalLeads,
        newLeads,
        qualifiedLeads,
      },
    });

  } catch (error: unknown) {

    res.status(500).json({
      message: "Server Error",
      error:
        error instanceof Error
          ? error.message
          : "Error occurred",
    });
  }
};