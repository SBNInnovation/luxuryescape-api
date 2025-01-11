import { Request, Response } from "express";
import Tour from "../../models/tours.models/tours.js";

interface AuthenticatedRequest extends Request{
    user?: any;
}

const recommendTours = async(req:AuthenticatedRequest, res:Response)=>{
    try {
        const userId = req.user;
        if(!userId){
            res.status(404).json({success:false, message: "Unauthorized"});
            return;
        }
        const tourId = req.query;
        if(!tourId){
            res.status(404).json({success:false, message: "Invalid request"});
            return;
        }
        const recommendTours = await Tour.findByIdAndUpdate({isRecommend:true},{new:true}) ;
        if(!recommendTours){
            res.status(404).json({success:false, message: "Unable to update"});
            return
        }
        res.status(200).json({success:true, message:"Activated the tour successfully",recommendTours})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, message:"Internal server error"})
    }
}

export default recommendTours;