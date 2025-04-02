import { Request, Response } from "express";
import Register from "../../models/signup.models/register.js";

const getUserData = async(req:Request,res:Response):Promise<void> =>{
    try {
        const {userId} = req.params;
        if(!userId){
            res.status(400).json({success:false, message:"User ID is required"});
            return
        }
        const user = await Register.findById(userId);
        if(!user){
            res.status(404).json({success:false, message:"User not found"});
            return
        }
        res.status(200).json({success:true, data:{name:user.name,email:user.email,number:user.phone}});

    } catch (error) {
        console.log(error)
        if(error instanceof(Error)){
            res.status(500).json({success:false, message:error.message});
        }
    }
}

export default getUserData;