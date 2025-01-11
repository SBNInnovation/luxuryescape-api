import { Request, Response } from "express";
import Tour from "../../models/tours.models/tours.js";

const getToursByActivate = async(req:Request,res:Response):Promise<void>=>{
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        const getActivateTours = await Tour.find({isActivate:true}).sort({createdAt:-1}).limit(limit).skip(skip);
        if(!getActivateTours){
             res.status(404).json({success:false, message:"No tours found"});
             return
        }
        const totalActivatedCount = await Tour.countDocuments({isActivate:true})
        res.status(200).json({success:true, data:getActivateTours,pagination:{
            page,
            limit,
            totalActivatedCount,
            totalPages:Math.ceil(totalActivatedCount/limit)
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message:"Internal Server Error"})
    }
}

export default getToursByActivate;