import { Router} from "express";
const leadRoutes = Router();
import { createLead,getLeads,updateLead,deleteLead,getLeadById} from "../controllers/lead.controller";
import { protect } from "../middleware/auth.middleware";
import { adminProtect } from "../middleware/admin.middleware";
import { exportLeads } from "../controllers/csvExport.controller";

leadRoutes.get("/export", protect, exportLeads); //csv file
leadRoutes.post("/",protect, createLead);  //create
leadRoutes.get("/", protect, getLeads);
leadRoutes.get("/:id", protect, getLeadById);   //get
leadRoutes.patch("/:id", protect, updateLead); //update by id
leadRoutes.delete("/:id", protect,adminProtect, deleteLead); //delete by id



export default leadRoutes;