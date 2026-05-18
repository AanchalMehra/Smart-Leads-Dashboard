import { Response } from "express";
import { Parser } from "json2csv";
import Lead from "../models/Lead";
import { AuthRequest } from "../middleware/auth.middleware";


export const exportLeads= async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query: Record<string, unknown> = {};
    //if sales user, get user id 
    // need to find only leads data related to specific sales person
    if (req.user?.role === "sales") {
      query.createdBy = req.user.id;
    }
    //get data in plain jvascript
    const leads = await Lead.find(query).lean();
    
    //check if any data exists
    if (leads.length === 0) {
      res.status(404).json({ message: "No leads found" });
      return;
    }

    // define  which fields go into CSV
    const fields = [
      { label: "Name", value: "name" },
      { label: "Email", value: "email" },
      { label: "Status", value: "status" },
      { label: "Source", value: "source" },
      { label: "Created At", value: "createdAt" },
    ];

    const parser = new Parser({fields});
    const csv = parser.parse(leads); 
    
    //set content type to inform the browser regarding the content
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=leads.csv");
    res.status(200).send(csv);

  } catch (error: unknown) {
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Error occurred",
    });
  }
};