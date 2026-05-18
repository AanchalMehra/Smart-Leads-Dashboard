import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export const adminProtect = (req: AuthRequest,res: Response,next: NextFunction
): void => {
  try {
    //check if tokens exists
    if(!req.user){
      res.status(401).json({ message: "Unauthorized" });
      return;
   }
   //check the role
   if(req.user.role!=="admin") {
      res.status(403).json({ message: "Admin access only" });
      return;
    }

    next();

}
catch(error:unknown){
     res.status(403).json({ message: "Access denied" });
}
}