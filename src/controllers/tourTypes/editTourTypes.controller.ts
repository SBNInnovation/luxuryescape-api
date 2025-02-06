import { Request, Response } from "express";
import TourTypes from "../../models/tourTypes.models/tourTypes.js";
import { uploadFile } from "../../utility/cloudinary.js";
import { Express } from "express";

export interface MulterRequest extends Request {
  file?: Express.Multer.File; // Represents the single file uploaded using multer.single()
}


const editTourTypes = async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    const { tourType, description } = req.body;
    const {tourTypeId} = req.params;

    if(!tourTypeId){
        res.status(404).json({success:false, message:"tourTypeID is required"});
    }

    if (!tourType || !description) {
      res.status(400).json({ success: false, message: "Please provide a tour type." });
      return;
    }
   

    const thumbnail = req?.file ||""; 
  
    const uploadedThumbnail = thumbnail
      ? 
      // await uploadFile(thumbnail.path || "", "tours/tourTypes/images")
      await uploadFile(`${req.file?.path}` || "", "tours/tourTypes/images")
      : null;

      const editTourType = await TourTypes.findByIdAndUpdate(
        tourTypeId,
        {
          $set: {
            thumbnail: uploadedThumbnail?.secure_url || "",
            tourType,
            slug: tourType.toLowerCase().replace(/\s+/g, "-"),
            description,
          },
        },
        { new: true } 
      );
    
      if(!editTourType){
        res.status(404).json({success:false, message:"tour type not found"});
    }
    res.status(200).json({ success: true, message:"tour type edited successfully", data: editTourType });

  } catch (error: unknown) {
    console.error("Error creating blog:", error);
  
    let errorMessage = "An unexpected error occurred.";
  
    if (error instanceof Error) {
      errorMessage = error.message;
    }
  
    res.status(500).json({ success: false, message: errorMessage });
  }
  
};

export default editTourTypes;
