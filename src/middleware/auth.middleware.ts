import { Request, Response, NextFunction } from "express";
import jwt , { JwtPayload }from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: JwtPayload;
}
export const protect = (req: AuthRequest,res: Response,next: NextFunction):void =>{
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            res.status(401).json({ message:"No token provided" })
            return;
        }
        const token=authHeader.split(" ")[1];
        if (!token) {
          res.status(401).json({ message: 'Missing token' });
          return;
        }

        const decode=jwt.verify(token,
            process.env.JWT_SECRET as string) as JwtPayload;
        req.user=decode;
        next();


    }
    catch(error:unknown){
          res.status(401).json({message:"Invalid or expired token"});
    }
}

