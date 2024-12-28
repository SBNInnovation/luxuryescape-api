import { Request, Response } from "express";
import Register from "../../models/signup.models/register";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";

const loginUser = async(req:Request,res:Response):Promise<void> =>{
    try {
        const {email,password} = req.body;
        if(!email || !password){
             res.status(404).json({success:false, message:"Email and password are required"});
             return
        }
        const user = await Register.findOne({email});
        if(!user){
             res.status(404).json({success:false, message:"User not found"});
            return
        }
        const checkPassword = bcrypt.compareSync(password,user.password)
        if(!checkPassword){
             res.status(404).json({success:false, message:"Invalid password"});
            return
        }
        const token = jwt.sign({userId:user._id},process.env.ACCESS_SECRET_KEY as string)
        if(!token){
             res.status(404).json({success:false, message:"Failed to generate token"});
            return
        }
        res.cookie("token",token,{httpOnly:true,maxAge:24*60*60})
        res.status(200).json({success:true, message:"Login successful",token})
    } catch (error) {
        res.status(400).json({success:false, message:"Internal server error"})
    }
}

export default loginUser