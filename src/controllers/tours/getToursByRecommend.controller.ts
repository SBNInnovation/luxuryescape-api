import { Request, Response } from "express";
import Tour from "../../models/tours.models/tours.js";

const getToursByRecommend = async(req:Request,res:Response):Promise<void>=>{
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        const getRecommendedTours = await Tour.find({isRecommend:true}).sort({createdAt:-1}).limit(limit).skip(skip);
        if(!getRecommendedTours){
             res.status(404).json({success:false, message:"No tours found"});
             return
        }
        const totalRecommendedCount = await Tour.countDocuments({isRecommend:true})
        res.status(200).json({success:true, data:getRecommendedTours,pagination:{
            page,
            limit,
            totalRecommendedCount,
            totalPage : Math.ceil(totalRecommendedCount/limit)
        }})
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message:"Internal Server Error"})
    }
}

export default getToursByRecommend;