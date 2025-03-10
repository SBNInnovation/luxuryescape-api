

// interface AuthenticatedRequest extends Request{
//     user?: any;
// }

import { Request, Response } from "express";
import Tour from "../../models/tours.models/tours.js";

const activateTours = async(req:Request, res:Response)=>{
    try {
        // const userId = req.user;
        // if(!userId){
        //     res.status(404).json({success:false, message: "Unauthorized"});
        //     return;
        // }
        const tourId = req.query;

        const activateTours = await Tour.findByIdAndUpdate(tourId,{isActivate:""},{new:true}) ;
        if(!activateTours){
            res.status(404).json({success:false, message: "Unable to update"});
            return
        }
        res.status(200).json({success:true, message:"Activated the tour successfully",activateTours})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, message:"Internal server error"})
    }
}

export default activateTours;