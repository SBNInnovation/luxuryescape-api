import { Request, Response } from "express";
import TourTypes from "../../models/tourTypes.models/tourTypes.js";

import { Express } from "express";
import { deleteFile, uploadFile } from "../../utility/cloudinary.js";

export interface MulterRequest extends Request {
  file?: Express.Multer.File; // Represents the single file uploaded using multer.single()
}

const editTourTypes = async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    const { tourType, description } = req.body;
    const { tourTypeId } = req.params;

    if (!tourTypeId) {
      res.status(400).json({ success: false, message: "tourTypeId is required" });
      return;
    }

    if (!tourType || !description) {
      res.status(400).json({ success: false, message: "Please provide tourType and description." });
      return;
    }

    const existingTourType = await TourTypes.findById(tourTypeId);
    if (!existingTourType) {
      res.status(404).json({ success: false, message: "Tour type not found" });
      return;
    }

    let uploadedThumbnailUrl = existingTourType.thumbnail;

    if (req.file) {
      // Upload new thumbnail
      const uploadedThumbnail = await uploadFile(req.file.path, "tours/tourTypes/images");
      uploadedThumbnailUrl = uploadedThumbnail?.secure_url || uploadedThumbnailUrl;

      // Delete old one from Cloudinary
      if (existingTourType.thumbnail && existingTourType.thumbnail !== uploadedThumbnailUrl) {
        await deleteFile(existingTourType.thumbnail);
      }
    }

    const updatedTourType = await TourTypes.findByIdAndUpdate(
      tourTypeId,
      {
        thumbnail: uploadedThumbnailUrl,
        tourType,
        slug: tourType.toLowerCase().replace(/\s+/g, "-"),
        description,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Tour type edited successfully",
      data: updatedTourType,
    });

  } catch (error: unknown) {
    console.error("Error editing tour type:", error);

    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    res.status(500).json({ success: false, message: errorMessage });
  }
};

export default editTourTypes;
