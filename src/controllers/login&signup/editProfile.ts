import { Request, Response } from "express";
import Register from "../../models/signup.models/register.js";
import bcrypt from "bcryptjs";

const updateProfile = async(req:Request, res:Response):Promise<void> =>{
    try {
        const userId = req.params.userId
        const {name, email, oldPassword, password, confirmPassword} = req.body;
        const user = await Register.findById(userId);
        if(!user) {
            res.status(404).json({success:false, message: "User not found"});
            return
        }
        if(password !== confirmPassword) {
            res.status(400).json({success:false, message: "Passwords do not match"});
            return
        }
        const checkPass = bcrypt.compareSync(user.password, oldPassword)
        if(!checkPass) {
            res.status(400).json({success:false, message: "Old password is incorrect"});
            return
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        user.name = name;
        user.email = email;
        user.password = hashedPassword;
        await user.save()

        res.status(200).json({success:true, message: "Profile updated successfully"});

    } catch (error) {
        
    }
}

export default updateProfile;