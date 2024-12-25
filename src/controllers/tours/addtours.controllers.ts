import { Request, Response } from "express";
// import slug from "slug";

import { uploadFile } from "../../utility/cloudinary";
import Tour from "../../models/tours.models/tours";
import { Express } from 'express';

interface MulterRequest extends Request {
  files?: {
    thumbnail?: Express.Multer.File[];
    destinationPhoto?: Express.Multer.File[];
    highlightPicture?: Express.Multer.File[];
    itineraryDayPhoto?: Express.Multer.File[];
    accommodationPics?: Express.Multer.File[];
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
      destination,
      tourOverview,
      keyHighlights,
      tourItinerary,
      faq,
    } = req.body;

    // const tourSlug = slug(tourName, { lower: true });

    if (
      !tourName ||
      !duration ||
      !idealTime ||
      !cost ||
      !tourTypes ||
      !destination ||
      !tourOverview ||
      !keyHighlights ||
      !tourItinerary ||
      !faq
    ) {
      res
        .status(400)
        .json({ success: false, message: "Please fill all the fields" });
        return
    }

    const thumbnail = req?.files?.thumbnail;
    const destinationPhoto = req?.files?.destinationPhoto;
    const highlightPicture = req?.files?.highlightPicture;
    const itineraryDayPhoto = req?.files?.itineraryDayPhoto;
    const accommodationPics = req?.files?.accommodationPics;

    console.log(req.files)
    
    if (!thumbnail || !destinationPhoto || !highlightPicture || !itineraryDayPhoto || !accommodationPics) {
       res.status(400).json({
        success: false,
        message: "Please upload all required files",
      });
      return;
    }
    
    // Uploading logic remains the same
    const uploadedThumbnail = await uploadFile(thumbnail[0]?.path || "", "tours/thumbnail/images");
    const uploadedDestinationPhoto = await uploadFile(destinationPhoto[0]?.path || "", "tours/destination/images");
    const uploadedHighlightPicture = await uploadFile(highlightPicture[0]?.path || "", "tours/highlight/images");
    const uploadedItineraryDayPhoto = await uploadFile(itineraryDayPhoto[0]?.path || "", "tours/itinerary/images");
    const uploadedAccommodationPics = await Promise.all(
      accommodationPics.map((file) => uploadFile(file?.path || "", "tours/accommodation/images"))
    );
    
    const parsedDestination = JSON.parse(destination);
    const parsedKeyHighlights = JSON.parse(keyHighlights);
    const parsedTourItinerary = JSON.parse(tourItinerary);
    const parsedFaq = JSON.parse(faq);

    const createTour = await Tour.create({
      tourName,
      slug: tourName,
      thumbnail: uploadedThumbnail?.secure_url,
      duration,
      idealTime,
      cost,
      tourTypes,
      destination: parsedDestination,
      destinationPhoto: uploadedDestinationPhoto?.secure_url,
      tourOverview,
      keyHighlights: parsedKeyHighlights,
      tourHighlights: parsedKeyHighlights,
      highlightPicture: uploadedHighlightPicture?.secure_url,
      tourItinerary: parsedTourItinerary,
      itinerary: parsedTourItinerary,
      itineraryDayPhoto: uploadedItineraryDayPhoto?.secure_url,
      accommodationPics: uploadedAccommodationPics,
      faq: parsedFaq,
    });

     res
      .status(201)
      .json({ success: true, message: "Tour added successfully", createTour });
      return
  } catch (error) {
    console.error("Error adding tour:", error);
     res
      .status(500)
      .json({ success: false, message: "Internal server error" });
      return
  }
};

export default addTour;

// add tours