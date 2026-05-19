import express from "express";
import { protect } from "../middleware/auth.middleware";
import { getDashboard } from "../controllers/dashboard.controller";
const router = express.Router();

router.get("/",protect,getDashboard)

export default router;