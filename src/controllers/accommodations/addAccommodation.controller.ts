import { Request, Response } from "express";
import { Express } from "express";
import Accommodation from "../../models/accommodation.models/Accommodation.js";
import { uploadFile } from "../../utility/cloudinary.js";

export interface MulterRequest extends Request {
  files?: {
    accommodationPics?: Express.Multer.File[];
    roomPhotos?: Express.Multer.File[];
  };
}

const addAccommodation = async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    const {
      accommodationTitle,
      accommodationLocation,
      accommodationRating,
      accommodationDescription,
      accommodationFeatures,
      accommodationAmenities,
      rooms,
    } = req.body;

    // Validate required fields
    if (!accommodationTitle || !accommodationLocation || !accommodationRating || !accommodationDescription) {
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

    const parsedRooms = typeof rooms === "string" ? JSON.parse(rooms) : rooms || [];

    if (!Array.isArray(parsedAccommodationAmenities) || !Array.isArray(parsedAccommodationFeatures) || !Array.isArray(parsedRooms)) {
      res.status(400).json({ success: false, message: "Features, amenities, and rooms must be arrays." });
      return;
    }

    // Handle file uploads using Multer
    const accommodationPics = req?.files?.accommodationPics || [];
    const roomPhotos = req?.files?.roomPhotos || [];

    // Upload accommodation pictures to Cloudinary and store URLs
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

    // Upload room photos to Cloudinary and store URLs
    const uploadedRoomPhotos = roomPhotos.length
      ? await Promise.all(
          roomPhotos.map(async (file) => {
            try {
              const uploaded = await uploadFile(file?.path || "", "tours/accommodation/rooms/images");
              return uploaded?.secure_url || null;
            } catch (error) {
              console.error("Error uploading room photo:", error);
              return null;
            }
          })
        )
      : [];

    // Remove null values (if any upload failed)
    const filteredAccommodationPics = uploadedAccommodationPics.filter((url) => url !== null);
    const filteredRoomPhotos = uploadedRoomPhotos.filter((url) => url !== null);

    // Generate slug from title
    const slug = accommodationTitle.toLowerCase().replace(/\s+/g, "-");

    // Create accommodation document
    const accommodation = await Accommodation.create({
      accommodationTitle,
      slug,
      accommodationLocation,
      accommodationRating,
      accommodationDescription,
      accommodationFeatures: parsedAccommodationFeatures,
      accommodationAmenities: parsedAccommodationAmenities,
      rooms: parsedRooms,
      accommodationPics: filteredAccommodationPics,
      roomPhotos: filteredRoomPhotos, // Will accept an empty array if no room photos
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
