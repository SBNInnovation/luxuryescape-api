import { Request, Response } from "express";
import { uploadFile } from "../../utility/cloudinary.js";
import slugify from "slugify";
import FineDining from "../../models/fine-dining.models/fine-dining.js";

export interface MulterRequest extends Request {
  files?: {
    pics?: Express.Multer.File[];
    logo?: Express.Multer.File[];
  };
}

const addFineDining = async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    const {
      title,
      location,
      country,
      destination,
      rating,
      description,
      features,
      amenities,
      policies
    } = req.body;

    // Validate required fields
    if (!title || !location || !rating || !description || ! country || !destination) {
      res.status(400).json({ success: false, message: "Missing required fields." });
      return;
    }

    // Parse JSON fields if they come as strings
    const parsedAccommodationAmenities = typeof amenities === "string"
      ? JSON.parse(amenities)
      : amenities || [];

    const parsedAccommodationFeatures = typeof features === "string"
      ? JSON.parse(features)
      : features || [];

      const parsedPolicies = typeof policies === "string" ?
      JSON.parse(policies) : policies || {};

    if (!Array.isArray(parsedAccommodationAmenities) || !Array.isArray(parsedAccommodationFeatures)) {
      res.status(400).json({ success: false, message: "Features, amenities, and rooms must be arrays." });
      return;
    }

    // Handle file uploads using Multer
    const pics = req?.files?.pics || [];
    const logo = req?.files?.logo || [];

    // Upload photos to Cloudinary and store URLs
    const uploadedAccommodationPics = pics.length
      ? await Promise.all(
          pics.map(async (file) => {
            try {
              const uploaded = await uploadFile(file?.path || "", "tours/finedining/images");
              return uploaded?.secure_url || null;
            } catch (error) {
              console.error("Error uploading fine pic:", error);
              return null;
            }
          })
        )
      : [];
    const uploadedLogo = logo.length
        ? await uploadFile(logo[0]?.path || "", "tours/finedining/logo")
        : null;
    const uploadedLogoUrl = uploadedLogo ? uploadedLogo.secure_url : null;

    // Remove null values (if any upload failed)
    const filteredAccommodationPics = uploadedAccommodationPics.filter((url) => url !== null);

    // Generate slug from title
    // const slug = slugify(accommodationTitle,{ lower: true }) ;
    const slug = slugify(title)

    // Create accommodation document
    const accommodation = await FineDining.create({
      title,
      slug,
      country,
      destination,
      location,
      rating,
      description,
      features: parsedAccommodationFeatures,
      amenities: parsedAccommodationAmenities,
      pics: filteredAccommodationPics,
      logo:uploadedLogoUrl,
      policies: parsedPolicies
    });

    if (!accommodation) {
      res.status(500).json({ success: false, message: "Failed to create accommodation." });
      return;
    }

    res.status(201).json({ success: true, message: "Created successfully", data:accommodation });
  } catch (error) {
    console.error("Error creating accommodation:", error);
    res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};

export default addFineDining;






