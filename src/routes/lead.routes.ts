import { Router} from "express";
const leadRoutes = Router();
import { createLead } from "../controllers/lead.controller";
import { protect } from "../middleware/auth.middleware";
leadRoutes.post("/",protect, createLead);

export default leadRoutes;