import { Request, Response } from "express";
import slugify from "slugify";
import { deleteFile, uploadFile } from "../../utility/cloudinary.js";
import FineDining from "../../models/fine-dining.models/fine-dining.js";

// import deleteImageGroup from "../../utility/deleteGroupedImage.js";

export interface MulterRequest extends Request {
  files?: {
    pics?: Express.Multer.File[];
    logo?: Express.Multer.File[];
  };
}


const editFineDining = async (req:MulterRequest , res: Response) => {
  try {
    const { fineDiningId } = req.params;
    const {
      title,
      location,
      country,
      destination,
      rating,
      description,
      features,
      amenities,
      policies,
      imageToDelete,
    } = req.body;

    // Validate accommodation ID
    if (!fineDiningId) {
      res.status(400).json({ success: false, message: "FineDining ID is required" });
      return;
    }

    // Find existing accommodation
    const existingAccommodation = await FineDining.findById(fineDiningId);
    if (!existingAccommodation) {
      res.status(404).json({ success: false, message: "FineDining not found" });
      return;
    }

    // Helper function to safely parse JSON data
    const parseJsonSafe = (data: any, fieldName: string) => {
      if (Array.isArray(data) || typeof data === "object") return data;
      try {
        return JSON.parse(data);
      } catch (error) {
        throw new Error(`Invalid JSON format in ${fieldName}`);
      }
    };

    // Parse accommodation data with error handling
    let parsedAccommodationAmenities;
    let parsedAccommodationFeatures;
    let parsedPolicies;
    let parsedImageToDelete: string[] = [];

    try {
      // Parse amenities, features, and policies
      parsedAccommodationAmenities = amenities
        ? parseJsonSafe(amenities, "amenities")
        : existingAccommodation.amenities;

      parsedAccommodationFeatures = features
        ? parseJsonSafe(features, "features")
        : existingAccommodation.features;

      parsedPolicies = policies
        ? parseJsonSafe(policies, "policies")
        : existingAccommodation.policies;

      // Parse images to delete
      parsedImageToDelete = imageToDelete ? JSON.parse(imageToDelete) : [];
    } catch (parseErr: any) {
      res.status(400).json({ success: false, message: parseErr.message });
      return;
    }

    // Validate required fields
    if (!parsedAccommodationAmenities || !parsedAccommodationFeatures) {
      res.status(400).json({ success: false, message: "Missing required features or amenities" });
      return;
    }

    // Handle image uploads
    const pics = (req as MulterRequest)?.files?.pics || [];
    const logo =req?.files?.logo || [];
    
    const uploadedAccommodationPics = await Promise.all(
      pics.map(async (file) => {
        try {
          const result = await uploadFile(file?.path || "", "tours/finedining/images");
          return result?.secure_url || null;
        } catch (err) {
          console.error("Error uploading file:", err);
          return null;
        }
      })
    );

    const uploadedLogo = logo.length
        ? await uploadFile(logo[0]?.path || "", "tours/finedining/logo")
        : null;
        
    const uploadedLogoUrl = uploadedLogo ? uploadedLogo.secure_url : existingAccommodation.logo;

    

    const uploadedAccommodationPicUrls = uploadedAccommodationPics.filter(Boolean); // Remove nulls

    // Handle image deletion
    let updatedImageList = existingAccommodation.pics;

    if (parsedImageToDelete.length > 0) {
      // Filter out deleted images from the list
      updatedImageList = updatedImageList.filter(pic => !parsedImageToDelete.includes(pic));
      
      // Delete images from Cloudinary
      try {
        await Promise.all(
          parsedImageToDelete.map(url => deleteFile(url))
        );
      } catch (deleteErr) {
        console.error("Failed to delete some images from Cloudinary:", deleteErr);
        // Continue with the update even if image deletion fails
      }
    }

    // Combine existing and new images
    const finalImageList = [...updatedImageList, ...uploadedAccommodationPicUrls];

    // Generate slug if title is updated
    const slug = title 
      ? slugify(title) 
      : existingAccommodation.slug;

    // Update accommodation in database
    const updatedAccommodation = await FineDining.findByIdAndUpdate(
      fineDiningId,
      {
        title: title || existingAccommodation.title,
        slug,
        country: country || existingAccommodation.country,
        destination: destination || existingAccommodation.destination,
        location: location || existingAccommodation.location,
        rating: rating || existingAccommodation.rating,
        description: description || existingAccommodation.description,
        features: parsedAccommodationFeatures,
        amenities: parsedAccommodationAmenities,
        pics: finalImageList,
        logo:uploadedLogoUrl,
        policies: parsedPolicies,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ 
      success: true, 
      message: "Updated successfully", 
      data: updatedAccommodation 
    });
  } catch (error) {
    console.error("Error editing accommodation:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export default editFineDining;
