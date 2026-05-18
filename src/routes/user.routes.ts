import { Router} from "express";
const userRoutes = Router();
import { protect } from "../middleware/auth.middleware";
import { adminProtect } from "../middleware/admin.middleware";
import { getAllUsers } from "../controllers/user.controller";

userRoutes.get("/",protect,adminProtect,getAllUsers);

export default userRoutes;



