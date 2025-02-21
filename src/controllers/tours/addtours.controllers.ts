import { Request, Response } from "express";
import { uploadFile } from "../../utility/cloudinary.js";
import Tour from "../../models/tours.models/tours.js";
import { Express } from "express";
import slugify from "slugify";

export interface MulterRequest extends Request {
  files?: {
    thumbnail?:Express.Multer.File[];
    gallery?: Express.Multer.File[];
    // highlightPicture?: Express.Multer.File[];
    itineraryDayPhoto?: Express.Multer.File[];
  };
}

// const addTour = async (req: MulterRequest, res: Response): Promise<void> => {
//   try {
//     const {
//       tourName,
//       duration,
//       idealTime,
//       cost,
//       tourTypes,
//       tourOverview,
//       keyHighlights,
//       tourHighlights,
//       tourInclusion,
//       tourItinerary,
//       faq,
//       location,
//       country
//     } = req.body;

//       if (
//         !tourName ||
//         !duration ||
//         !idealTime ||
//         !cost ||
//         !tourTypes ||
//         !tourOverview ||
//         !keyHighlights ||
//         !tourInclusion ||
//         !tourHighlights ||
//         !tourItinerary ||
//         !faq ||
//         !location ||
//         !country
//       ) {
//         res.status(400).json({ success: false, message: `Please fill ${req.body} fields` });
//         return;
//       }
  
//       // Check for files in the request, but allow them to be optional
//       const thumbnail = req?.files?.thumbnail ||[]; 
//       const gallery = req?.files?.gallery || [];
//       const highlightPicture = req?.files?.highlightPicture || [];
//       const itineraryDayPhoto = req?.files?.itineraryDayPhoto || [];
      
//       // Upload files only if they are provided
//       const uploadedThumbnail = thumbnail.length
//       ? await uploadFile(thumbnail[0]?.path || "", "tours/thumbnail/images")
//       :null;

//       const uploadedGallery = gallery.length
//         ? await Promise.all(gallery.map((file) => uploadFile(file?.path || "", "tours/gallery/images")))
//         : [];
//       const uploadedHighlightPicture = highlightPicture.length
//         ? await uploadFile(highlightPicture[0]?.path || "", "tours/highlight/images")
//         : null;
//       const uploadedItineraryDayPhoto = itineraryDayPhoto.length
//         ? await uploadFile(itineraryDayPhoto[0]?.path || "", "tours/itinerary/images")
//         : null;

//     // Parsing JSON fields
//     const parsedIdealTime = JSON.parse(idealTime);
//     const parsedKeyHighlights = JSON.parse(keyHighlights);
//     const parsedTourHighlights = JSON.parse(tourHighlights);
//     const parsedTourItinerary = JSON.parse(tourItinerary);
//     const parsedFaq = JSON.parse(faq);
//     const parsedTourInclusion = JSON.parse(tourInclusion);


//     // Creating the tour
//     const createTour = await Tour.create({
//       tourName,
//       slug: tourName.toLowerCase().replace(/\s+/g, "-"),
//       thumbnail: uploadedThumbnail,
//       country,
//       location,
//       duration,
//       idealTime:parsedIdealTime,
//       cost:Number(cost),
//       tourTypes,
//       tourOverview,
//       keyHighlights: parsedKeyHighlights,
//       tourHighlights: parsedTourHighlights,
//       highlightPicture: uploadedHighlightPicture?.secure_url,
//       tourInclusion:parsedTourInclusion,
//       tourItinerary: parsedTourItinerary,
//       itineraryDayPhoto: uploadedItineraryDayPhoto?.secure_url,
//       faq: parsedFaq,
//       gallery: uploadedGallery?.map((file)=> file?.secure_url),
//     });

//     res.status(201).json({ success: true, message: "Tour added successfully", createTour });
//   } catch (error) {
//     console.error("Error adding tour:", error);
//     if(error instanceof(Error)){
//       res.status(500).json({ success: false, message: error.message });
//     }
//   }
// };
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
      // tourHighlights,
      tourInclusion,
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
    if (!keyHighlights) missingFields.push("keyHighlights");
    if (!tourInclusion) missingFields.push("tourInclusion");
    // if (!tourHighlights) missingFields.push("tourHighlights");
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
      const gallery = req?.files?.gallery || [];
      // const highlightPicture = req?.files?.highlightPicture || [];
      const itineraryDayPhoto = req?.files?.itineraryDayPhoto || [];
      
      const uploadedThumbnail = thumbnail.length
      ? await uploadFile(thumbnail[0]?.path || "", "tours/thumbnail/images")
      : null;
      const uploadedThumbnailUrl = uploadedThumbnail ? uploadedThumbnail.secure_url : null;
      
      const uploadedGallery = gallery.length
        ? await Promise.all(gallery.map((file) => uploadFile(file?.path || "", "tours/gallery/images")))
        : [];
      const uploadedGalleryUrls = uploadedGallery.map(file => file?.secure_url);
      
      const uploadedItineraryDayPhoto = itineraryDayPhoto.length
        ? await uploadFile(itineraryDayPhoto[0]?.path || "", "tours/itinerary/images")
        : null;
      const uploadedItineraryDayPhotoUrl = uploadedItineraryDayPhoto ? uploadedItineraryDayPhoto.secure_url : null;
    

    // Helper function to safely parse JSON or return the original value if it's already an array
    const parseJsonSafe = (data: any, fieldName: string) => {
      if (Array.isArray(data)) {
        return data;  
      }

      try {
        return JSON.parse(data);  // Attempt to parse the string as JSON
      } catch (error) {
        res.status(400).json({ success: false, message: `Invalid JSON format in ${fieldName}` });
        return [];  // Return empty array on error
      }
    };

    const parsedIdealTime = parseJsonSafe(idealTime, "idealTime");
    const parsedKeyHighlights = parseJsonSafe(keyHighlights, "keyHighlights");
    const parsedTourItinerary = parseJsonSafe(tourItinerary, "tourItinerary");
    const parsedFaq = parseJsonSafe(faq, "faq");
    const parsedTourInclusion = parseJsonSafe(tourInclusion, "tourInclusion");


    // const parsedIdealTime = parseJsonSafe(idealTime, "idealTime");
    // const parsedKeyHighlights = parseJsonSafe(keyHighlights, "keyHighlights");
    // // const parsedTourHighlights = parseJsonSafe(tourHighlights, "tourHighlights");
    // const parsedTourItinerary = parseJsonSafe(tourItinerary, "tourItinerary");
    // const parsedFaq = parseJsonSafe(faq, "faq");
    // const parsedTourInclusion = parseJsonSafe(tourInclusion, "tourInclusion");

    // Create Tour
    const createTour = await Tour.create({
      tourName,
      slug: slugify(tourName, { lower: true }),
      thumbnail: uploadedThumbnailUrl,
      country,
      location,
      duration,
      idealTime: parsedIdealTime,
      cost: Number(cost),
      tourTypes,
      tourOverview,
      keyHighlights: parsedKeyHighlights,
      tourHighlights: [
        {
          highlightsTitle: "Hello",
          highlightPicture: "https://images.png"
        },{
          highlightsTitle: "World",
          highlightPicture: "https://images.png"
        }
      ],
      // highlightPicture: uploadedHighlightPicture?.secure_url,
      tourInclusion: parsedTourInclusion,
      tourItinerary: parsedTourItinerary,
      itineraryDayPhoto: uploadedItineraryDayPhotoUrl,
      faq: parsedFaq,
      gallery: uploadedGalleryUrls,
    });

    res.status(201).json({ success: true, message: "Tour added successfully", createTour });

  } catch (error) {
    console.error("Error adding tour:", error);
    if(error instanceof(Error)){
      res.status(500).json({ success: false, message: error.message });
    }
  }
};


export default addTour;

// add tours