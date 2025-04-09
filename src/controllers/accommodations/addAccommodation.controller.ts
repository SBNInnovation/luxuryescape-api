import { Request, Response } from "express";

import { uploadFile } from "../../utility/cloudinary.js";
import slugify from "@sindresorhus/slugify";
import Accommodation from "../../models/accommodation.models/Accommodation.js";

export interface MulterRequest extends Request {
  files?: {
    accommodationPics?: Express.Multer.File[];
  };
}

const addAccommodation = async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    const {
      accommodationTitle,
      accommodationLocation,
      country,
      destination,
      accommodationRating,
      accommodationDescription,
      accommodationFeatures,
      accommodationAmenities,
      policies
    } = req.body;

    // Validate required fields
    if (!accommodationTitle || !accommodationLocation || !accommodationRating || !accommodationDescription || ! country || !destination) {
      res.status(400).json({ success: false, message: "Missing required fields." });
      return;
    }

    // Parse JSON fields if they come as strings
    const parsedAccommodationAmenities = typeof accommodationAmenities === "string"
      ? JSON.parse(accommodationAmenities)
      : accommodationAmenities || [];

    const parsedAccommodationFeatures = typeof accommodationFeatures === "string"
      ? JSON.parse(accommodationFeatures)
      : accommodationFeatures || [];

      const parsedPolicies = typeof policies === "string" ?
      JSON.parse(policies) : policies || {};

    if (!Array.isArray(parsedAccommodationAmenities) || !Array.isArray(parsedAccommodationFeatures)) {
      res.status(400).json({ success: false, message: "Features, amenities, and rooms must be arrays." });
      return;
    }

    // Handle file uploads using Multer
    const accommodationPics = req?.files?.accommodationPics || [];

    // Upload photos to Cloudinary and store URLs
    const uploadedAccommodationPics = accommodationPics.length
      ? await Promise.all(
          accommodationPics.map(async (file) => {
            try {
              const uploaded = await uploadFile(file?.path || "", "tours/accommodation/images");
              return uploaded?.secure_url || null;
            } catch (error) {
              console.error("Error uploading accommodation pic:", error);
              return null;
            }
          })
        )
      : [];

    // Remove null values (if any upload failed)
    const filteredAccommodationPics = uploadedAccommodationPics.filter((url) => url !== null);

    // Generate slug from title
    // const slug = slugify(accommodationTitle,{ lower: true }) ;
    const slug = slugify(accommodationTitle)

    // Create accommodation document
    const accommodation = await Accommodation.create({
      accommodationTitle,
      slug,
      country,
      destination,
      accommodationLocation,
      accommodationRating,
      accommodationDescription,
      accommodationFeatures: parsedAccommodationFeatures,
      accommodationAmenities: parsedAccommodationAmenities,
      accommodationPics: filteredAccommodationPics,
      policies: parsedPolicies
    });

    if (!accommodation) {
      res.status(500).json({ success: false, message: "Failed to create accommodation." });
      return;
    }

    res.status(201).json({ success: true, message: "Accommodation created successfully", data:accommodation });
  } catch (error) {
    console.error("Error creating accommodation:", error);
    res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};

export default addAccommodation;






