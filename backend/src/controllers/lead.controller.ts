import {Response } from "express";
import Lead from "../models/Lead";
import { AuthRequest } from "../middleware/auth.middleware";

type LeadType ={
  name: string;
  email: string;
  status?:"New" |"Contacted" |"Qualified" |"Lost";
  source: "Website"|"Instagram"|"Referral";
  phone: string;
  notes: string;
}

//CREATE LEAD
//POST 
export const createLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, status, source, phone, notes }: LeadType = req.body;

    // 1. Required validation
    if (!name || !email || !source) {
      res.status(400).json({ message: "Required fields are missing" });
      return;
    }

    // 2. Ensure user exists (VERY IMPORTANT)
    if (!req.user?.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // 3. Optional: duplicate check (recommended for CRM)
    const existingLead = await Lead.findOne({ email });
    if (existingLead) {
      res.status(409).json({ message: "Lead already exists with this email" });
      return;
    }

    // 4. Create lead
    const lead = await Lead.create({
      name,
      email,
      phone,
      notes,
      status: status || "New",
      source,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Lead created successfully",
      lead,
    });
  } catch (error: unknown) {
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Error occurred",
    });
  }
};

//GET LEADS
//GET

export const getLeads = async (req: AuthRequest,res: Response
):Promise<void>=> {
  try {
    const { page = "1", limit = "10", status, source, search, sort = "latest" } =
      req.query as Record<string,string|undefined>;
    
    //all filters for query
    type LeadQuery = {
        status?: "New"|"Contacted"|"Qualified"|"Lost";
        source?: "Website"|"Instagram"|"Referral";
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
        limit: limitNum,
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

 
//GET LEAD BY ID
//GET
export const getLeadById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const lead = await Lead.findById(id);
    //check if lead exists or not
    if (!lead) {
      res.status(404).json({ message: "Lead not found" });
      return;
    }

    // sales can only view their own lead
    if (
      req.user?.role === "sales" &&
      lead.createdBy.toString() !== req.user.id
    ) {
      res.status(403).json({ message: "Not authorized" });
      return;
    }

    res.status(200).json({ data: lead });
    return;

  } catch (error: unknown) {
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Error occurred",
    });
  }
};

//UPDATE LEAD
//PATCH
export const updateLead = async (req: AuthRequest,res: Response
):Promise<void>=> {
  try {
    const {id} = req.params;
    //find the lead
    const existingLead= await Lead.findById(id);
    
    //if lead does not exists
    if (!existingLead) {
      res.status(404).json({message: "Lead not found"});
      return;
    }
     
    //check if the lead is created by the same sales person
    if (
      req.user?.role === "sales" &&
      existingLead.createdBy.toString() !== req.user.id
    ) {
      res.status(403).json({ message: "Not authorized" });
      return;
    }
    

    const { name, email, status,phone,notes, source } = req.body;

    //update lead
     const lead = await Lead.findByIdAndUpdate(
       id,
       { name, email, status, phone, notes, source },
       { new: true } // returns updated lead
    );

    res.status(200).json({message: "Lead Updated successfully",lead});
    return;
  }
  
  catch(error: unknown) {
    res.status(500).json({message: "Server error",
        error: error instanceof Error ? error.message :"Error occured",
    })
}
}


//DETELE LEAD
//DELETE
export const deleteLead = async (req: AuthRequest,res: Response
):Promise<void>=> {
  try {
    const {id} = req.params;
    //find the lead
    const existingLead= await Lead.findById(id);
    
    //if lead does not exists
    if (!existingLead) {
      res.status(404).json({message: "Lead not found"});
      return;
    }
     
    //check if the lead is created by the same sales person
    if (
      req.user?.role === "sales" &&
      existingLead.createdBy.toString() !== req.user.id
    ) {
      res.status(403).json({ message: "Not authorized" });
      return;
    }
    
    //delete the lead
    await Lead.findByIdAndDelete(id);

    res.status(200).json({message: "Lead Deleted successfully"});
    return;
  }
  
  catch(error: unknown) {
    res.status(500).json({message: "Server error",
        error: error instanceof Error ? error.message :"Error occured",
    })
}
}


