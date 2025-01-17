import { Request, Response } from "express";
import { uploadFile } from "../../utility/cloudinary.js";
import Tour from "../../models/tours.models/tours.js";
import { Express } from "express";

interface MulterRequest extends Request {
  files?: {
    thumbnail?:Express.Multer.File[];
    gallery?: Express.Multer.File[];
    destinationPhoto?: Express.Multer.File[];
    highlightPicture?: Express.Multer.File[];
    itineraryDayPhoto?: Express.Multer.File[];
    accommodationPics?: Express.Multer.File[];
    roomPhotos?: Express.Multer.File[];
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
      tourHighlights,
      tourInclusion,
      tourItinerary,
      faq,
      location,
      country,
      // isRecommend,
      // isActivate,
    } = req.body;

      if (
        !tourName ||
        !duration ||
        !idealTime ||
        !cost ||
        !tourTypes ||
        !destination ||
        !tourOverview ||
        !keyHighlights ||
        !tourInclusion ||
        !tourHighlights ||
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
      const destinationPhoto = req?.files?.destinationPhoto || [];
      const highlightPicture = req?.files?.highlightPicture || [];
      const itineraryDayPhoto = req?.files?.itineraryDayPhoto || [];
      const accommodationPics = req?.files?.accommodationPics || [];
      const roomPhotos = req?.files?.roomPhotos || [];

      // Upload files only if they are provided
      const uploadedThumbnail = thumbnail.length
      ? await uploadFile(thumbnail[0]?.path || "", "thumbnail/itinerary/images")
      :null;

      const uploadedGallery = gallery.length
        ? await Promise.all(gallery.map((file) => uploadFile(file?.path || "", "tours/gallery/images")))
        : [];
      const uploadedDestinationPhoto = destinationPhoto.length
        ? await uploadFile(destinationPhoto[0]?.path || "", "tours/destination/images")
        : null;
      const uploadedHighlightPicture = highlightPicture.length
        ? await uploadFile(highlightPicture[0]?.path || "", "tours/highlight/images")
        : null;
      const uploadedItineraryDayPhoto = itineraryDayPhoto.length
        ? await uploadFile(itineraryDayPhoto[0]?.path || "", "tours/itinerary/images")
        : null;
      const uploadedAccommodationPics = accommodationPics.length
        ? await Promise.all(accommodationPics.map((file) => uploadFile(file?.path || "", "tours/accommodation/images")))
        : [];
        const uploadedRoomPhotos = roomPhotos.length
        ? await Promise.all(accommodationPics.map((file) => uploadFile(file?.path || "", "tours/accommodation/images")))
        : [];
   

    // Parsing JSON fields
    const parsedDestination = JSON.parse(destination);
    const parsedKeyHighlights = JSON.parse(keyHighlights);
    const parsedTourHighlights = JSON.parse(tourHighlights);
    const parsedTourItinerary = JSON.parse(tourItinerary);
    const parsedFaq = JSON.parse(faq);

    // Creating the tour
    const createTour = await Tour.create({
      tourName,
      slug: tourName.toLowerCase().replace(/\s+/g, "-"),
      thumbnail: uploadedThumbnail,
      country,
      location,
      duration,
      idealTime,
      cost,
      tourTypes,
      destination: parsedDestination,
      destinationPhoto: uploadedDestinationPhoto?.secure_url,
      tourOverview,
      keyHighlights: parsedKeyHighlights,
      tourHighlights: parsedTourHighlights,
      highlightPicture: uploadedHighlightPicture?.secure_url,
      tourInclusion,
      tourItinerary: parsedTourItinerary.map((itinerary:any) => ({
        ...itinerary,
        accomodation: itinerary.accommodation || [],
        rooms: itinerary.accommodation.rooms || [],
        links: itinerary.links || [],
      })),
      itineraryDayPhoto: uploadedItineraryDayPhoto?.secure_url,
      accommodationPics: uploadedAccommodationPics.map((file) => file?.secure_url),
      roomPhotos: uploadedRoomPhotos.map((file) =>file?.secure_url),
      faq: parsedFaq,
      gallery: uploadedGallery,
      // isRecommend: isRecommend || false,
      // isActivate: isActivate || false,
    });

    res.status(201).json({ success: true, message: "Tour added successfully", createTour });
  } catch (error) {
    console.error("Error adding tour:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



export default addTour;

// add tours