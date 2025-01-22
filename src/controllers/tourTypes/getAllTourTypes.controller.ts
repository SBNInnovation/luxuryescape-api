import { Request, Response } from "express";
import TourTypes from "../../models/tourTypes.models/tourTypes.js";

const getAllTourTypes = async(req:Request,res:Response):Promise<void> =>{
    try {
        const allTourTypes = await TourTypes.find({});
        if(!allTourTypes){
            res.status(404).json({success:false, message:"No tour types found"});
            return;
        }
        res.status(200).json({success:true, message:"Fetched all tourTypes successfully", allTourTypes});
    } catch (error) {
        console.log(error);
        res.status(400).json({success:false, message:"Internal server error"})
    }
}

export default getAllTourTypes;