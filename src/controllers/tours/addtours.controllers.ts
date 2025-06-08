import { Request, Response } from "express";
import { uploadFile } from "../../utility/cloudinary.js";
import Tour from "../../models/tours.models/tours.js";
import slugify from "slugify";

export interface MulterRequest extends Request {
  files?: {
    thumbnail?:Express.Multer.File[];
    routeMap?:Express.Multer.File[];
    gallery?: Express.Multer.File[];
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
      tourHighlights,
      tourInclusion,
      tourExclusion,
      tourItinerary,
      faq,
      location,
      country
    } = req.body;

    // Validate required fields
    const missingFields = [];
    if (!tourName) missingFields.push("tourName");
    if (!duration) missingFields.push("duration");
    if (!idealTime) missingFields.push("idealTime");
    if (!cost) missingFields.push("cost");
    if (!tourTypes) missingFields.push("tourTypes");
    if (!tourOverview) missingFields.push("tourOverview");
    if (!tourInclusion) missingFields.push("tourInclusion");
    if (!tourExclusion) missingFields.push("tourExclusion");
    if (!tourHighlights) missingFields.push("tourHighlights");
    if (!tourItinerary) missingFields.push("tourItinerary");
    if (!faq) missingFields.push("faq");
    if (!location) missingFields.push("location");
    if (!country) missingFields.push("country");

    if (missingFields.length > 0) {
      res.status(400).json({ success: false, message: `Missing fields: ${missingFields.join(', ')}` });
      return
    }

    // Validate cost
    if (isNaN(cost) || cost <= 0) {
       res.status(400).json({ success: false, message: "Cost must be a valid positive number" });
       return
    }

     // Check for files in the request, but allow them to be optional
      const thumbnail = req?.files?.thumbnail ||[]; 
      const routeMap =req?.files?.routeMap || [];
      const gallery = req?.files?.gallery || [];
      // const highlightPicture = req?.files?.highlightPicture || [];
      const itineraryDayPhoto = req?.files?.itineraryDayPhoto || [];
      
      const uploadedThumbnail = thumbnail.length
      ? await uploadFile(thumbnail[0]?.path || "", "tours/thumbnail/images")
      : null;
      const uploadedThumbnailUrl = uploadedThumbnail ? uploadedThumbnail.secure_url : null;

      const uploadedRouteMap = routeMap.length
      ? await uploadFile(routeMap[0]?.path || "", "tours/route-map/images")
      : null;
      const uploadedRouteMapUrl = uploadedRouteMap ? uploadedRouteMap.secure_url: null;
      
      const uploadedGallery = gallery.length
        ? await Promise.all(gallery.map((file) => uploadFile(file?.path || "", "tours/gallery/images")))
        : [];
      const uploadedGalleryUrls = uploadedGallery.map(file => file?.secure_url);
      
      const uploadedItineraryDayPhoto = itineraryDayPhoto.length
      ? await Promise.all(itineraryDayPhoto.map((file) => uploadFile(file?.path || "", "tours/gallery/images")))
      : [];
      const uploadedItineraryDayPhotoUrl = uploadedItineraryDayPhoto.map(file => file?.secure_url);

      // const uploadedHighlightPicture = highlightPicture.length? 
      // await Promise.all(highlightPicture.map((file) => uploadFile(file?.path || "", "tours/gallery/images"))):[];

      // const uploadedHighlightPictureUrls = uploadedHighlightPicture.map(file => file?.secure_url);
    

    // Helper function to safely parse JSON or return the original value if it's already an array
    const parseJsonSafe = (data: any, fieldName: string) => {
      if (Array.isArray(data)) {
        return data;  
      }

      try {
        return JSON.parse(data);  
      } catch (error) {
        res.status(400).json({ success: false, message: `Invalid JSON format in ${fieldName}` });
        return [];  
      }
    };

    const parsedIdealTime = parseJsonSafe(idealTime, "idealTime");
    const parsedTourItinerary = parseJsonSafe(tourItinerary, "tourItinerary");
    const parsedFaq = parseJsonSafe(faq, "faq");
    const parsedTourInclusion = parseJsonSafe(tourInclusion, "tourInclusion");
    const parsedTourExclusion = parseJsonSafe(tourExclusion, "tourExclusion");
    const parsedTourHighlights = parseJsonSafe(tourHighlights, "tourHighlights");

    const checkExistingTour = await Tour.findOne({tourName})
    if (checkExistingTour) {
      res.status(400).json({ success: false, message: "Tour already exists" });
      return;
    }
   const slug1 = slugify(tourName)
    // Create Tour
    const createTour = await Tour.create({
      tourName,
      slug:slug1 ,
      thumbnail: uploadedThumbnailUrl,
      routeMap:uploadedRouteMapUrl,
      country,
      location,
      duration,
      idealTime: parsedIdealTime,
      cost: Number(cost),
      tourTypes,
      tourOverview,
      tourHighlights: parsedTourHighlights,
      // highlightPicture: uploadedHighlightPictureUrls,
      tourInclusion: parsedTourInclusion,
      tourExclusion: parsedTourExclusion,
      tourItinerary: parsedTourItinerary,
      itineraryDayPhoto: uploadedItineraryDayPhotoUrl,
      faq: parsedFaq,
      gallery: uploadedGalleryUrls,
    });

    res.status(201).json({ success: true, message: "Tour added successfully", data:createTour });

  } catch (error) {
    console.error("Error adding tour:", error);
    if(error instanceof(Error)){
      res.status(500).json({ success: false, message: error.message });
    }
  }
};


export default addTour;

// add tours