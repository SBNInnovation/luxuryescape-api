import { Request, Response } from "express";
import TourTypes from "../../models/tourTypes.models/tourTypes.js";
import { uploadFile } from "../../utility/cloudinary.js";
import { Express } from "express";

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
      ? await uploadFile(thumbnail.path || "", "tours/tourTypes/images")
      : null;

    const newTourType = await TourTypes.create({ 
        thumbnail: uploadedThumbnail?.secure_url || "",
        tourType ,
        slug: tourType.toLowerCase().replace(/\s+/g, "-"),
        description,
    });
    console.log(newTourType)

    res.status(201).json({
      success: true,
      message: "Tour type added successfully.",
      newTourType,
    });
  } catch (error) {
    console.error("Error adding tour type:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export default addTourTypes;
