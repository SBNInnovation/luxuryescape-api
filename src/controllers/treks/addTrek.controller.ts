import { Request, Response } from "express";
import { uploadFile } from "../../utility/cloudinary.js";
import Trek from "../../models/trek.models/trek.js";
import slugify from "@sindresorhus/slugify";


export interface MulterRequest extends Request {
  files?: {
    thumbnail?: Express.Multer.File[];
    routeMap?:Express.Multer.File[];
    gallery?: Express.Multer.File[];
    highlightPicture?: Express.Multer.File[];
    itineraryDayPhoto?: Express.Multer.File[];
  };
}

const addTrek = async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    const {
      trekName,
      duration,
      idealTime,
      cost,
      difficultyLevel,
      trekOverview,
      trekHighlights,
      trekInclusion,
      trekExclusion,
      trekItinerary,
      faq,
      location,
      country,
    } = req.body;

    // Validate required fields
    const missingFields = [];
    if (!trekName) missingFields.push("trekName");
    if (!duration) missingFields.push("duration");
    if (!idealTime) missingFields.push("idealTime");
    if (!cost) missingFields.push("cost");
    if (!difficultyLevel) missingFields.push("difficultyLevel");
    if (!trekOverview) missingFields.push("trekOverview");
    if (!trekInclusion) missingFields.push("trekInclusion");
    if (!trekExclusion) missingFields.push("trekExclusion");
    if (!trekHighlights) missingFields.push("trekHighlights");
    if (!trekItinerary) missingFields.push("trekItinerary");
    if (!faq) missingFields.push("faq");
    if (!location) missingFields.push("location");
    if (!country) missingFields.push("country");

    if (missingFields.length > 0) {
      res.status(400).json({ success: false, message: `Missing fields: ${missingFields.join(", ")}` });
      return;
    }

    // Validate cost
    if (isNaN(cost) || cost <= 0) {
      res.status(400).json({ success: false, message: "Cost must be a valid positive number" });
      return;
    }

    // Check for files in the request, but allow them to be optional
    const thumbnail = req?.files?.thumbnail || [];
    const routeMap =req?.files?.routeMap || [];
    const gallery = req?.files?.gallery || [];
    const highlightPicture = req?.files?.highlightPicture || [];
    const itineraryDayPhoto = req?.files?.itineraryDayPhoto || [];

    const uploadedThumbnail = thumbnail.length
      ? await uploadFile(thumbnail[0]?.path || "", "treks/thumbnail/images")
      : null;
    const uploadedThumbnailUrl = uploadedThumbnail ? uploadedThumbnail.secure_url : null;

    const uploadedRouteMap = routeMap.length
      ? await uploadFile(routeMap[0]?.path || "", "treks/route-map/images")
      : null;
    const uploadedRouteMapUrl = uploadedRouteMap ? uploadedRouteMap.secure_url: null;

    const uploadedGallery = gallery.length
      ? await Promise.all(gallery.map((file) => uploadFile(file?.path || "", "treks/gallery/images")))
      : [];
    const uploadedGalleryUrls = uploadedGallery.map((file) => file?.secure_url);

    const uploadedItineraryDayPhoto = itineraryDayPhoto.length
      ? await Promise.all(itineraryDayPhoto.map((file) => uploadFile(file?.path || "", "treks/gallery/images")))
      : [];
    const uploadedItineraryDayPhotoUrl = uploadedItineraryDayPhoto.map((file) => file?.secure_url);

    const uploadedHighlightPicture = highlightPicture.length
      ? await Promise.all(highlightPicture.map((file) => uploadFile(file?.path || "", "treks/gallery/images")))
      : [];
    const uploadedHighlightPictureUrls = uploadedHighlightPicture.map((file) => file?.secure_url);

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
    const parsedTrekItinerary = parseJsonSafe(trekItinerary, "trekItinerary");
    const parsedFaq = parseJsonSafe(faq, "faq");
    const parsedTrekInclusion = parseJsonSafe(trekInclusion, "trekInclusion");
    const parsedTrekExclusion = parseJsonSafe(trekExclusion, "trekExclusion");
    const parsedTrekHighlights = parseJsonSafe(trekHighlights, "trekHighlights");

    const checkExistingTrek = await Trek.findOne({ trekName });
    if (checkExistingTrek) {
      res.status(400).json({ success: false, message: "Trek already exists" });
      return;
    }
    const slug1 = slugify(trekName)
    // Create Trek
    const createTrek = await Trek.create({
      trekName,
      slug: slug1,
      thumbnail: uploadedThumbnailUrl,
      routeMap: uploadedRouteMapUrl,
      country,
      location,
      duration,
      idealTime: parsedIdealTime,
      cost: Number(cost),
      difficultyLevel,
      trekOverview,
      trekHighlights: parsedTrekHighlights,
      highlightPicture: uploadedHighlightPictureUrls,
      trekInclusion: parsedTrekInclusion,
      trekExclusion: parsedTrekExclusion,
      trekItinerary: parsedTrekItinerary,
      itineraryDayPhoto: uploadedItineraryDayPhotoUrl,
      faq: parsedFaq,
      gallery: uploadedGalleryUrls,
    });

    res.status(201).json({ success: true, message: "Trek added successfully", data: createTrek });
  } catch (error) {
    console.error("Error adding trek:", error);
    if (error instanceof Error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

export default addTrek;
