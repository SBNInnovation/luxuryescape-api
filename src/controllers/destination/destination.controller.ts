import { Request, Response } from "express";
import { deleteFile, uploadFile } from "../../utility/cloudinary.js";
import Destination from "../../models/destination.models/destination.js";

export interface MulterRequest extends Request {
  files?: {
    image?: Express.Multer.File[];
  };
}

const createDestination = async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    const title = req.body.title?.trim();
    const description = req.body.description?.trim();

    if (!title || !description) {
      res.status(400).json({ success: false, message: "Please fill in all fields." });
      return;
    }

    let uploadedImageUrl = "";

    if (req.files?.image?.[0]) {
      const uploadedThumbnail = await uploadFile(req.files.image[0].path, "destinations/images");
      if (uploadedThumbnail?.secure_url) {
        uploadedImageUrl = uploadedThumbnail.secure_url;
      } else {
        res.status(500).json({ success: false, message: "Image upload failed." });
        return;
      }
    }

    const destination = await Destination.create({
      title,
      description,
      image: uploadedImageUrl,
    });

    res.status(201).json({ success: true, data: destination });

  } catch (error) {
    console.error("Error in createDestination:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};


const getDestinationById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { destinationId } = req.params;
  
      const destination = await Destination.findById(destinationId);
  
      if (!destination) {
        res.status(404).json({ success: false, message: "Destination not found." });
        return;
      }
  
      res.status(200).json({ success: true, data: destination });
  
    } catch (error) {
      console.error("Error fetching destination:", error);
      res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Server error" });
    }
  };

  const updateDestination = async (req: MulterRequest, res: Response): Promise<void> => {
    try {
      const { destinationId } = req.params;
      const { title, description, removeImage } = req.body;
  
      // Find the destination by ID
      const destination = await Destination.findById(destinationId);
      if (!destination) {
        res.status(404).json({ success: false, message: "Destination not found." });
        return;
      }
  
      let updatedImageUrl = destination.image; // Keep the current image URL by default

      // If image is being removed explicitly
      if (removeImage&& destination.image) {
        // Delete the image from Cloudinary
        await deleteFile(destination.image); // Delete the existing image
        updatedImageUrl = ""; // Set the image URL to an empty string
      }
  
      // If a new image is uploaded, handle the upload and update URL
      if (req.files?.image?.[0]) {
        const uploadedImage = await uploadFile(req.files.image[0].path, "destinations/images");
        if (!uploadedImage?.secure_url) {
          res.status(500).json({ success: false, message: "Image upload failed." });
          return;
        }
        updatedImageUrl = uploadedImage.secure_url; // Update with the new image URL
      }
  
      // Update the other fields
      destination.title = title?.trim() || destination.title;
      destination.description = description?.trim() || destination.description;
      destination.image = updatedImageUrl; // Set the new image URL or keep the old one if no new image was uploaded
  
      // Save the updated destination
      await destination.save();
  
      res.status(200).json({ success: true, data: destination });
  
    } catch (error) {
      console.error("Error updating destination:", error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Server error",
      });
    }
  };

  const deleteDestination = async (req: Request, res: Response): Promise<void> => {
    try {
      const { destinationId } = req.params;
  
      const deleted = await Destination.findByIdAndDelete(destinationId);
  
      if (!deleted) {
        res.status(404).json({ success: false, message: "Destination not found." });
        return;
      }
  
      res.status(200).json({ success: true, message: "Destination deleted successfully." });
  
    } catch (error) {
      console.error("Error deleting destination:", error);
      res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Server error" });
    }
  };
  

  const getAllDestinations = async (req: Request, res: Response): Promise<void> => {
    try {
      // Fetch all destinations from the database
      const destinations = await Destination.find();
  
      // Check if no destinations were found
      if (destinations.length === 0) {
        res.status(404).json({ success: false, message: "No destinations found." });
        return;
      }
  
      res.status(200).json({ success: true, data: destinations });
    } catch (error) {
      console.error("Error fetching all destinations:", error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Server error",
      });
    }
  };
  
  
  
export { createDestination,
    updateDestination,
    deleteDestination,
    getDestinationById,
    getAllDestinations
 };
