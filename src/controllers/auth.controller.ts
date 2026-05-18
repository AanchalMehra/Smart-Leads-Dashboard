import {Request,Response} from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import jwt from "jsonwebtoken";
interface SignupBody {
  name: string;
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

 export const signup=async(req:Request<{},{},SignupBody>, res:Response) :Promise<void>=> {
    try{
        const { name,email, password } = req.body;
        //check if all fields are filled
        if(!name||!email||!password){
             res.status(400).json({ message: "All fields are required" });
             return;
        }

        //check if user email already exists
        const existing= await User.findOne({email})
        if (existing) {
           res.status(400).json({message: "User already exists"})
           return;
        }

        //hashing password and create new user
        const hashedPassword=await bcrypt.hash(password,10);

        
        await User.create({
            name,
            email,
            password:hashedPassword,
            role:"sales",
        });
        
        res.status(201).json({message:"User created successfully"});
        return;

    }
    catch(error:unknown){
        res.status(500).json({message:"Server Error",
            error: error instanceof Error ? error.message :"Error occured"});
        return;
    }
 }


  export const login=async(req:Request<{},{},LoginBody>, res:Response) :Promise<void>=> {
    try{
        const {email, password} = req.body;
        //check if all fields are filled
        if(!email||!password){
             res.status(400).json({ message: "All fields are required" });
             return;
        }

        //check if user email already exists or not
        const existing= await User.findOne({email})
        if (!existing) {
           res.status(400).json({message: "Invalid credentials"})
           return;
        }

        //Compare password 
        const match=await bcrypt.compare(password,existing.password);
        if (!match) {
           res.status(400).json({message: "Invalid credentials"})
           return;
        }

        //payload for jwt token
        const payload={
            id:existing._id.toString(),
            email:existing.email,
            role:existing.role
        }

        //create jwt token
        const token=jwt.sign(payload,process.env.JWT_SECRET as string,{expiresIn:"7d"});
        
        res.status(200).json({message:"User Login successfully",
            user:{
                id: existing._id.toString(),
                name: existing.name,
                email: existing.email,
                role: existing.role,
            },token
        })
        return;

    }
    catch(error:unknown){
        res.status(500).json({message:"Server Error",
            error: error instanceof Error ? error.message :"Error occured"});
        return;
    }
 }