import { Request, Response } from "express";
import Register from "../../models/signup.models/register";
import { generateOtp, sendOtpEmail } from "../../middleware/forgotPassword";
import bcrypt from "bcryptjs"

const sendotp = async(req:Request,res:Response):Promise<void> =>{
    try {
        const {email} = req.body;
        if(!email){
             res.status(404).json({success:false, message:"Email is required"});
             return
        }
        const findValidUser = await Register.findOne({email});
        if(!findValidUser){
             res.status(404).json({success:false, message:"Email is not registered"});
             return
            }
        const otp = generateOtp(6);
        if(!otp){
             res.status(404).json({success:false, message:"Failed to generate OTP"});
             return
        }
        const sentOtp = sendOtpEmail(email,otp);
        findValidUser.otp = otp;
        await findValidUser.save()
        res.status(200).json({success:true,message:"Otp sent successfully",sentOtp})

    } catch (error) {
        res.status(400).json({success:false, message:"Internal server error",error})
    }
}

const verifyOtp = async(req:Request,res:Response):Promise<void> =>{
    try {
        const {otp} = req.body;
        if(!otp){
            res.status(404).json({success:false, message:"Otp is required"});
            return
        }
        const verify  = await Register.findOne({otp});
        if(!verify){
            res.status(404).json({success:false, message:"Invalid otp"});
            return
            }
        res.status(200).json({success:true,message:"Otp verified"})
    } catch (error) {
        res.status(400).json({success:false, message:"Internal server error",error})
    }
}

const generatePassword = async(req:Request,res:Response) =>{
    try {
        const{email,password} = req.body;
        if(!password){
            res.status(404).json({success:false, message:"Password is required"});
            return
        }
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const user = await Register.findOneAndUpdate(
            { email }, // Find user by email
            { password: hashedPassword }, // Update the password
            { new: true } // Return the updated document
          );
        if(!user){
            res.status(404).json({success:false, message:"Failed to update password"});
            return
        }
        res.status(200).json({success:true,message:"Password updated successfully",user: { email: user.email, name: user.name }, // Return non-sensitive data 
            })

    } catch (error) {
        res.status(400).json({success:false,message:"Internal server error"})
    }
}

export {sendotp,verifyOtp,generatePassword};