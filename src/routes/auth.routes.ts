import { Router} from "express";
const authrouter = Router();
import { signup,login } from "../controllers/auth.controller";
authrouter.post("/signup", signup);
authrouter.get("/login",login);
export default authrouter;