import { Request, Response } from "express";
import { uploadFile } from "../../utility/cloudinary.js";
import Tour from "../../models/tours.models/tours.js";
import { Express } from "express";

export interface MulterRequest extends Request {
  files?: {
    thumbnail?:Express.Multer.File[];
    gallery?: Express.Multer.File[];
    destinationPhoto?: Express.Multer.File[];
    highlightPicture?: Express.Multer.File[];
    itineraryDayPhoto?: Express.Multer.File[];
  };
}

const addTour = async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    const {
      tourName,
      duration,
      idealTime,
      cost,
      tourTypes,
      tourOverview,
      keyHighlights,
      tourHighlights,
      tourInclusion,
      accommodation,
      tourItinerary,
      faq,
      location,
      country
    } = req.body;

      if (
        !tourName ||
        !duration ||
        !idealTime ||
        !cost ||
        !tourTypes ||
        !tourOverview ||
        !keyHighlights ||
        !tourInclusion ||
        !tourHighlights ||
        !accommodation ||
        !tourItinerary ||
        !faq ||
        !location ||
        !country
      ) {
        res.status(400).json({ success: false, message: "Please fill all required fields" });
        return;
      }
  
      // Check for files in the request, but allow them to be optional
      const thumbnail = req?.files?.thumbnail ||[]; 
      const gallery = req?.files?.gallery || [];
      const highlightPicture = req?.files?.highlightPicture || [];
      const itineraryDayPhoto = req?.files?.itineraryDayPhoto || [];
      
      // Upload files only if they are provided
      const uploadedThumbnail = thumbnail.length
      ? await uploadFile(thumbnail[0]?.path || "", "tours/thumbnail/images")
      :null;

      const uploadedGallery = gallery.length
        ? await Promise.all(gallery.map((file) => uploadFile(file?.path || "", "tours/gallery/images")))
        : [];
      const uploadedHighlightPicture = highlightPicture.length
        ? await uploadFile(highlightPicture[0]?.path || "", "tours/highlight/images")
        : null;
      const uploadedItineraryDayPhoto = itineraryDayPhoto.length
        ? await uploadFile(itineraryDayPhoto[0]?.path || "", "tours/itinerary/images")
        : null;

    // Parsing JSON fields
    const parsedIdealTime = JSON.parse(idealTime);
    const parsedKeyHighlights = JSON.parse(keyHighlights);
    const parsedTourHighlights = JSON.parse(tourHighlights);
    const parsedTourItinerary = JSON.parse(tourItinerary);
    const parsedFaq = JSON.parse(faq);
    const parsedTourInclusion = JSON.parse(tourInclusion);


    // Creating the tour
    const createTour = await Tour.create({
      tourName,
      slug: tourName.toLowerCase().replace(/\s+/g, "-"),
      thumbnail: uploadedThumbnail,
      country,
      location,
      duration,
      idealTime:parsedIdealTime,
      cost:Number(cost),
      tourTypes,
      tourOverview,
      keyHighlights: parsedKeyHighlights,
      tourHighlights: parsedTourHighlights,
      highlightPicture: uploadedHighlightPicture?.secure_url,
      tourInclusion:parsedTourInclusion,
      accommodation,
      tourItinerary: parsedTourItinerary,
      itineraryDayPhoto: uploadedItineraryDayPhoto?.secure_url,
      faq: parsedFaq,
      gallery: uploadedGallery?.map((file)=> file?.secure_url),
    });

    res.status(201).json({ success: true, message: "Tour added successfully", createTour });
  } catch (error) {
    console.error("Error adding tour:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default addTour;

// add tours