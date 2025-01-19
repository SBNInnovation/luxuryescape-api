import { Request, Response } from "express";
import TourTypes from "../../models/tourTypes.models/tourTypes.js";

const addTourTypes = async(req:Request, res:Response):Promise<void>=>{
    try {
        const {tourType} = req.body;
        if(!tourType){
             res.status(404).json({success:false, message:"Please provide tour types"});
             return
        }
        const newTourTypes = await TourTypes .create({tourType});
        if(!newTourTypes){
             res.status(404).json({success:false, message:"Failed to add tour types"});
             return
        }
        res.status(200).json({success:true, message:"tour types added successfully", newTourTypes})

    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message:"internal server error"});
    }
}

export default addTourTypes;