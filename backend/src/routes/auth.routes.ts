import { Router} from "express";
const authRoutes = Router();
import { signup,login,getSession } from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middleware";
authRoutes.post("/signup", signup);
authRoutes.post("/login",login);
authRoutes.get("/session", protect, getSession);
export default authRoutes;