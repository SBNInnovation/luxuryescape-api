import { Request, Response } from "express";
import slugify from "slugify";
import Accommodation from "../../models/accommodation.models/Accommodation.js";
import { deleteFile, uploadFile } from "../../utility/cloudinary.js";

// import deleteImageGroup from "../../utility/deleteGroupedImage.js";

export interface MulterRequest extends Request {
  files?: {
    accommodationPics?: Express.Multer.File[];
    logo?: Express.Multer.File[];
  };
}


const editAccommodation = async (req:MulterRequest , res: Response) => {
  try {
    const { accommodationId } = req.params;
    const {
      accommodationTitle,
      accommodationLocation,
      country,
      destination,
      accommodationRating,
      accommodationDescription,
      accommodationFeatures,
      accommodationAmenities,
      policies,
      imageToDelete,
    } = req.body;

    // Validate accommodation ID
    if (!accommodationId) {
      res.status(400).json({ success: false, message: "Accommodation ID is required" });
      return;
    }

    // Find existing accommodation
    const existingAccommodation = await Accommodation.findById(accommodationId);
    if (!existingAccommodation) {
      res.status(404).json({ success: false, message: "Accommodation not found" });
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
      parsedAccommodationAmenities = accommodationAmenities
        ? parseJsonSafe(accommodationAmenities, "accommodationAmenities")
        : existingAccommodation.accommodationAmenities;

      parsedAccommodationFeatures = accommodationFeatures
        ? parseJsonSafe(accommodationFeatures, "accommodationFeatures")
        : existingAccommodation.accommodationFeatures;

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
    const accommodationPics = (req as MulterRequest)?.files?.accommodationPics || [];
    const logo =req?.files?.logo || [];
    
    const uploadedAccommodationPics = await Promise.all(
      accommodationPics.map(async (file) => {
        try {
          const result = await uploadFile(file?.path || "", "tours/accommodation/images");
          return result?.secure_url || null;
        } catch (err) {
          console.error("Error uploading file:", err);
          return null;
        }
      })
    );

    const uploadedLogo = logo.length
        ? await uploadFile(logo[0]?.path || "", "tours/accommdation/logo")
        : null;
        
    const uploadedLogoUrl = uploadedLogo ? uploadedLogo.secure_url : existingAccommodation.logo;

    

    const uploadedAccommodationPicUrls = uploadedAccommodationPics.filter(Boolean); // Remove nulls

    // Handle image deletion
    let updatedImageList = existingAccommodation.accommodationPics;

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
    const slug = accommodationTitle 
      ? slugify(accommodationTitle) 
      : existingAccommodation.slug;

    // Update accommodation in database
    const updatedAccommodation = await Accommodation.findByIdAndUpdate(
      accommodationId,
      {
        accommodationTitle: accommodationTitle || existingAccommodation.accommodationTitle,
        slug,
        country: country || existingAccommodation.country,
        destination: destination || existingAccommodation.destination,
        accommodationLocation: accommodationLocation || existingAccommodation.accommodationLocation,
        accommodationRating: accommodationRating || existingAccommodation.accommodationRating,
        accommodationDescription: accommodationDescription || existingAccommodation.accommodationDescription,
        accommodationFeatures: parsedAccommodationFeatures,
        accommodationAmenities: parsedAccommodationAmenities,
        accommodationPics: finalImageList,
        logo:uploadedLogoUrl,
        policies: parsedPolicies,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ 
      success: true, 
      message: "Accommodation updated successfully", 
      data: updatedAccommodation 
    });
  } catch (error) {
    console.error("Error editing accommodation:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export default editAccommodation;
