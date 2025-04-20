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
            const fileName = tourType.thumbnail.split('/').pop();         // abc123.jpg
            const publicId = fileName?.split('.')[0];                 // abc123
            const fullPublicId = `tours/tourTypes/images/${publicId}`;       // ✅ with folder
            if (fullPublicId) {
              const deleteResult = await deleteFile(fullPublicId);
              if (!deleteResult) {
                res.status(500).json({ sueccess: false, message: "Failed to delete thumbnail image from Cloudinary" });
                return;
              }
            }
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