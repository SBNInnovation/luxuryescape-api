import { Request, Response } from "express";
import Tour from "../../models/tours.models/tours.js";

const getSpecifictour = async(req:Request,res:Response):Promise<void> =>{
    try {
        const slug = req.params.slug;
        if(!slug){
             res.status(404).json({success:false, message:"slug is required"});
             return
        }
        const specificTour = await Tour.findOne({slug});
        if(!specificTour){
             res.status(404).json({success:false, message:"tour not found"});
             return
        }
        res.status(200).json({success:true, message:"Specific tour data",data:specificTour})
    } catch (error) {
        console.log(error)
        res.status(400).json({success:false, message:"internal server error"})
    }
}

export default getSpecifictour;