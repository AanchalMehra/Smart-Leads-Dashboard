import {Response } from "express";
import Lead from "../models/Leads";
import { leadBody } from "../models/Leads";
import { AuthRequest } from "../middleware/auth.middleware";
interface LeadInterface {
  name: string;
  email: string;
  status?:"New" |"Contacted" |"Qualified" |"Lost";
  source: "Website"|"Instagram"|"Referral";
}

//CREATE LEAD
//POST 
export const createLead = async (req: AuthRequest,res: Response
):Promise<void>=> {
  try {
    const { name,email,status,source }:LeadInterface = req.body;

    //validation
    if (!name||!email||!source) {
      res.status(400).json({ message:"Required fields are missing"});
      return;
    }

    //create lead
    const lead = await Lead.create({
      name,
      email,
      status: status || "New",
      source,
      createdBy: req.user?.id,
    });

    res.status(201).json({message: "Lead created successfully",lead});
    return;
  }
  
  catch(error: unknown) {
    res.status(500).json({message: "Server error",
        error: error instanceof Error ? error.message :"Error occured",
    })
}
}

//GET LEADS
//GET

export const getLeads = async (req: AuthRequest,res: Response
):Promise<void>=> {
  try {
    const { page = "1", limit = "10", status, source, search, sort = "latest" } =
      req.query as Record<string, string | undefined>;
    
    //all filters for query
    type LeadQuery = {
        status?: "New" | "Contacted" | "Qualified" | "Lost";
        source?: "Website" | "Instagram" | "Referral";
        createdBy?: string;
        $or?: Array<{
            name?: { $regex: string; $options: "i" };
            email?: { $regex: string; $options: "i" };
        }>;
        }

    const query: LeadQuery = {};

     //admin has access to all leads but sales has access to their own leads only
     if (req.user?.role==="sales") {
      query.createdBy = req.user.id;
    }
    if (source) query.source = source as "Website" | "Instagram" | "Referral";
    if (status) query.status = status as "New" | "Contacted" | "Qualified" | "Lost";

    //search 
    if (search) {
      query.$or = [
        //using regular expression pattern matching
        { name: { $regex: search || "", $options: "i" } },
        { email: { $regex: search || "", $options: "i" } },
      ];
    }

    
    //sort by condition (latest or oldest)
    const sortOrder=sort==="oldest" ? 1 : -1;

    //define where to start pages from
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;
    
    //pagination
    const leads=await Lead.find(query)
    .sort({createdAt:sortOrder})
    .skip(skip)
    .limit(limitNum);
     

    const total = await Lead.countDocuments(query);

    res.status(200).json({
      data: leads,  //current page leads
      pagination: {
        total,  //total leads
        page: pageNum,  //current page number
        pages: Math.ceil(total / limitNum), //total pages
      },
    });

    
  }
  
  catch(error: unknown) {
    res.status(500).json({message: "Server error",
        error: error instanceof Error ? error.message :"Error occured",
    })
}
}