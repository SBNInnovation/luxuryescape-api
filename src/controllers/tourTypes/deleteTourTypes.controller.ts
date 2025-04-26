import { Request, Response } from "express";
import TourTypes from "../../models/tourTypes.models/tourTypes.js";
import { deleteFile } from "../../utility/cloudinary.js";

const deleteTourType = async(req:Request,res:Response):Promise<void> =>{
    try {
        const {tourTypeId} = req.params;
        if(!tourTypeId){
            res.status(404).json({success:false, message:"tourTypeId is required"});
            return
        }
        const tourType = await TourTypes.findByIdAndDelete(tourTypeId);
        if(!tourType){
            res.status(404).json({success:false, message:"tourType not found"});
            return
        }
        if (tourType.thumbnail) {
            await deleteFile(tourType.thumbnail)
          }
        res.status(200).json({success:true, message:"tourType deleted successflly"});

    } catch (error) {
        console.log(error);
        if(error instanceof Error){
            res.status(500).json({success:false, message:error.message});
        }

    }
}

export default deleteTourType;