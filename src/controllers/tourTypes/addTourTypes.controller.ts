import { Request, Response } from "express";
import TourTypes from "../../models/tourTypes.models/tourTypes.js";
import { uploadFile } from "../../utility/cloudinary.js";

export interface MulterRequest extends Request {
  file?: Express.Multer.File; // Represents the single file uploaded using multer.single()
}


const addTourTypes = async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    const { tourType, description } = req.body;

    if (!tourType || !description) {
      res.status(400).json({ success: false, message: "Please provide a tour type." });
      return;
    }
    const existingTourType = await TourTypes.findOne({ tourType });
    if (existingTourType) {
      res.status(409).json({ success: false, message: "Tour type already exists." });
      return;
    }

    const thumbnail = req?.file ||""; 
  
    const uploadedThumbnail = thumbnail
      ? 
      // await uploadFile(thumbnail.path || "", "tours/tourTypes/images")
      await uploadFile(`${req.file?.path}` || "", "tours/tourTypes/images")
      : null;

    const newTourType = await TourTypes.create({ 
        thumbnail: uploadedThumbnail?.secure_url || "",
        tourType ,
        slug: tourType.toLowerCase().replace(/\s+/g, "-"),
        description,
    });

    res.status(201).json({
      success: true,
      message: "Tour type added successfully.",
      newTourType,
    });
  } catch (error: unknown) {
    console.error("Error creating blog:", error);
  
    let errorMessage = "An unexpected error occurred.";
  
    if (error instanceof Error) {
      errorMessage = error.message;
    }
  
    res.status(500).json({ success: false, message: errorMessage });
  }
  
};

export default addTourTypes;
