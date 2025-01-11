import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request{
    user?: any;
}


const authenticate = async(req:AuthenticatedRequest, res:Response, next:NextFunction):Promise<void>=>{
    try {
        const cookies = req.cookies.token 
        if (!cookies) {
             res.status(401).json({success:false, message: "Unable to get the accessToken"});
             return;
        }
        const decoded = jwt.verify(cookies, process.env.SECRET_KEY as string);
        if(!decoded){
             res.status(401).json({success:false, message: "Unverified user"});
             return;
        }
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error)
        res.status(404).json({success:false, message:"error invalid server"})
    }
}

export default authenticate