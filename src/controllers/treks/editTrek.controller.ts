// import { Request, Response } from "express";
// import slugify from "@sindresorhus/slugify";
// import Trek from "../../models/trek.models/trek.js";
// import { uploadFile } from "../../utility/cloudinary.js";

// export interface MulterRequest extends Request {
//   files?: {
//     thumbnail?: Express.Multer.File[];
//     routeMap?:Express.Multer.File[];
//     gallery?: Express.Multer.File[];
//     highlightPicture?: Express.Multer.File[];
//     itineraryDayPhoto?: Express.Multer.File[];
//   };
// }

// const editTrek = async (req: MulterRequest, res: Response): Promise<void> => {
//   try {
//     const { trekId } = req.params;
//     const {
//       trekName,
//       duration,
//       idealTime,
//       cost,
//       difficultyLevel,
//       trekOverview,
//       trekHighlights,
//       trekInclusion,
//       trekExclusion,
//       trekItinerary,
//       faq,
//       location,
//       country,
//     } = req.body;

//     if (!trekId) {
//       res.status(400).json({ success: false, message: "Trek ID is required" });
//       return;
//     }

//     const existingTrek = await Trek.findById(trekId);
//     if (!existingTrek) {
//       res.status(404).json({ success: false, message: "Trek not found" });
//       return;
//     }

//     if (cost && (isNaN(cost) || cost <= 0)) {
//       res.status(400).json({ success: false, message: "Cost must be a valid positive number" });
//       return;
//     }

//     const thumbnail = req?.files?.thumbnail || [];
//     const routeMap = req?.files?.routeMap || [];
//     const gallery = req?.files?.gallery || [];
//     const highlightPicture = req?.files?.highlightPicture || [];
//     const itineraryDayPhoto = req?.files?.itineraryDayPhoto || [];

//     const uploadedThumbnail = thumbnail.length
//       ? await uploadFile(thumbnail[0]?.path || "", "treks/thumbnail/images")
//       : null;
//     const uploadedThumbnailUrl = uploadedThumbnail ? uploadedThumbnail.secure_url : existingTrek.thumbnail;

//     const uploadedRouteMap = routeMap.length
//     ? await uploadFile(routeMap[0]?.path || "", "tours/route-map/images")
//     : null;
//     const uploadedRouteMapUrl = uploadedRouteMap ? uploadedRouteMap.secure_url: null;

//     const uploadedGallery = gallery.length
//       ? await Promise.all(gallery.map((file) => uploadFile(file?.path || "", "treks/gallery/images")))
//       : [];
//     const uploadedGalleryUrls = uploadedGallery.length > 0 ? uploadedGallery.map(file => file?.secure_url) : existingTrek.gallery;

//     const uploadedItineraryDayPhoto = itineraryDayPhoto.length
//       ? await Promise.all(itineraryDayPhoto.map((file) => uploadFile(file?.path || "", "treks/gallery/images")))
//       : [];
//     const uploadedItineraryDayPhotoUrls = uploadedItineraryDayPhoto.length > 0 ? uploadedItineraryDayPhoto.map(file => file?.secure_url) : existingTrek.itineraryDayPhoto;

//     const uploadedHighlightPicture = highlightPicture.length
//       ? await Promise.all(highlightPicture.map((file) => uploadFile(file?.path || "", "treks/highlightPicture/images")))
//       : [];
//     const uploadedHighlightPictureUrls = uploadedHighlightPicture.length > 0 ? uploadedHighlightPicture.map(file => file?.secure_url) : existingTrek.highlightPicture;

//     const parseJsonSafe = (data: any, fieldName: string) => {
//       if (Array.isArray(data)) return data;
//       try {
//         return JSON.parse(data);
//       } catch (error) {
//         res.status(400).json({ success: false, message: `Invalid JSON format in ${fieldName}` });
//         return null;
//       }
//     };

//     const parsedIdealTime = idealTime ? parseJsonSafe(idealTime, "idealTime") : existingTrek.idealTime;
//     const parsedTrekItinerary = trekItinerary ? parseJsonSafe(trekItinerary, "trekItinerary") : existingTrek.trekItinerary;
//     const parsedFaq = faq ? parseJsonSafe(faq, "faq") : existingTrek.faq;
//     const parsedTrekInclusion = trekInclusion ? parseJsonSafe(trekInclusion, "trekInclusion") : existingTrek.trekInclusion;
//     const parsedTrekExclusion = trekExclusion ? parseJsonSafe(trekExclusion, "trekExclusion"): existingTrek.trekExclusion;
//     const parsedTrekHighlights = trekHighlights ? parseJsonSafe(trekHighlights, "trekHighlights") : existingTrek.trekHighlights;

//     const slug1 = trekName ? slugify(trekName) : existingTrek.slug;

//     const updatedTrek = await Trek.findByIdAndUpdate(
//       trekId,
//       {
//         trekName,
//         slug: slug1,
//         thumbnail: uploadedThumbnailUrl,
//         routeMap: uploadedRouteMapUrl,
//         country,
//         location,
//         duration,
//         idealTime: parsedIdealTime,
//         cost: cost ? Number(cost) : existingTrek.cost,
//         difficultyLevel,
//         trekOverview,
//         trekHighlights: parsedTrekHighlights,
//         highlightPicture: uploadedHighlightPictureUrls,
//         trekInclusion: parsedTrekInclusion,
//         trekExclusion: parsedTrekExclusion,
//         trekItinerary: parsedTrekItinerary,
//         itineraryDayPhoto: uploadedItineraryDayPhotoUrls,
//         faq: parsedFaq,
//         gallery: uploadedGalleryUrls,
//       },
//       { new: true }
//     );

//     res.status(200).json({ success: true, message: "Trek updated successfully", data: updatedTrek });
//   } catch (error) {
//     console.error("Error editing trek:", error);
//     if (error instanceof Error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   }
// };

// export default editTrek;






import { Request, Response } from "express";
import slugify from "@sindresorhus/slugify";
import Trek from "../../models/trek.models/trek.js";
import { uploadFile, deleteFile } from "../../utility/cloudinary.js";
// import deleteImageGroup from "../../utility/deleteGroupedImage.js";

export interface MulterRequest extends Request {
  files?: {
    thumbnail?: Express.Multer.File[];
    routeMap?: Express.Multer.File[];
    gallery?: Express.Multer.File[];
    highlightPicture?: Express.Multer.File[];
    itineraryDayPhoto?: Express.Multer.File[];
  };
}

const editTrek = async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    const { trekId } = req.params;
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
      galleryToDelete,
      highlightPictureToDelete,
      itineraryDayPhotoToDelete,
    } = req.body;

    if (!trekId) {
      res.status(400).json({ success: false, message: "Trek ID is required" });
      return;
    }

    const existingTrek = await Trek.findById(trekId);
    if (!existingTrek) {
      res.status(404).json({ success: false, message: "Trek not found" });
      return;
    }

    if (cost && (isNaN(cost) || cost <= 0)) {
      res.status(400).json({ success: false, message: "Cost must be a valid positive number" });
      return;
    }

        // === HANDLE IMAGE DELETION ARRAYS FROM req.body ===
        const parseDeleteArray = (data: any) => {
          try {
            return data ? JSON.parse(data) : [];
          } catch {
            return [];
          }
        };

    // FILES
    const thumbnail = req?.files?.thumbnail ||[]; 
    const routeMap =req?.files?.routeMap || [];
    const gallery = req?.files?.gallery || [];
    const highlightPicture = req?.files?.highlightPicture || [];
    const itineraryDayPhoto = req?.files?.itineraryDayPhoto || [];

    const uploadedThumbnail = thumbnail.length
      ? await uploadFile(thumbnail[0]?.path || "", "treks/thumbnail/images")
      : null;
    const uploadedThumbnailUrl = uploadedThumbnail ? uploadedThumbnail.secure_url : existingTrek.thumbnail;

    const uploadedRouteMap = routeMap.length
      ? await uploadFile(routeMap[0]?.path || "", "treks/route-map/images")
      : null;
    const uploadedRouteMapUrl = uploadedRouteMap ? uploadedRouteMap.secure_url : existingTrek.routeMap;

    const parsedGalleryToDelete = parseDeleteArray(galleryToDelete);
    const parsedHighlightToDelete = parseDeleteArray(highlightPictureToDelete);
    const parsedItineraryPhotoToDelete = parseDeleteArray(itineraryDayPhotoToDelete);


    // Upload new images
    const uploadedGallery = gallery.length
      ? await Promise.all(gallery.map((file) => uploadFile(file?.path || "", "treks/gallery/images")))
      : [];
    const uploadedGalleryUrls = uploadedGallery.map((file) => file?.secure_url).filter(Boolean);

    const uploadedHighlightPicture = highlightPicture.length
      ? await Promise.all(highlightPicture.map((file) => uploadFile(file?.path || "", "treks/gallery/images")))
      : [];
    const uploadedHighlightPictureUrls = uploadedHighlightPicture.map((file) => file?.secure_url).filter(Boolean);

    const uploadedItineraryDayPhoto = itineraryDayPhoto.length
      ? await Promise.all(itineraryDayPhoto.map((file) => uploadFile(file?.path || "", "treks/gallery/images")))
      : [];
    const uploadedItineraryDayPhotoUrls = uploadedItineraryDayPhoto.map((file) => file?.secure_url).filter(Boolean);

    
       // Remove deleted ones from existing arrays
       const finalGallery = existingTrek.gallery.filter((url: string) => !parsedGalleryToDelete.includes(url));
       const finalHighlightPicture = existingTrek.highlightPicture.filter((url: string) => !parsedHighlightToDelete.includes(url));
       const finalItineraryDayPhoto = existingTrek.itineraryDayPhoto.filter((url: string) => !parsedItineraryPhotoToDelete.includes(url));
   
       // Delete from Cloudinary
       const allToDelete = [
         ...parsedGalleryToDelete,
         ...parsedHighlightToDelete,
         ...parsedItineraryPhotoToDelete,
       ];
   
       for (const url of allToDelete) {
         await deleteFile(url);
       }

    // Final image arrays
    const finalGalleryUrls = [...finalGallery, ...uploadedGalleryUrls];
    const finalHighlightPictureUrls = [...finalHighlightPicture, ...uploadedHighlightPictureUrls];
    const finalItineraryDayPhotoUrls = [...finalItineraryDayPhoto, ...uploadedItineraryDayPhotoUrls];

    const parseJsonSafe = (data: any, fieldName: string) => {
      if (Array.isArray(data)) return data;
      try {
        return JSON.parse(data);
      } catch (error) {
        res.status(400).json({ success: false, message: `Invalid JSON format in ${fieldName}` });
        return null;
      }
    };

    const parsedIdealTime = idealTime ? parseJsonSafe(idealTime, "idealTime") : existingTrek.idealTime;
    const parsedTrekItinerary = trekItinerary ? parseJsonSafe(trekItinerary, "trekItinerary") : existingTrek.trekItinerary;
    const parsedFaq = faq ? parseJsonSafe(faq, "faq") : existingTrek.faq;
    const parsedTrekInclusion = trekInclusion ? parseJsonSafe(trekInclusion, "trekInclusion") : existingTrek.trekInclusion;
    const parsedTrekExclusion = trekExclusion ? parseJsonSafe(trekExclusion, "trekExclusion") : existingTrek.trekExclusion;
    const parsedTrekHighlights = trekHighlights ? parseJsonSafe(trekHighlights, "trekHighlights") : existingTrek.trekHighlights;

    const slug1 = trekName ? slugify(trekName) : existingTrek.slug;

    const updatedTrek = await Trek.findByIdAndUpdate(
      trekId,
      {
        trekName,
        slug: slug1,
        thumbnail: uploadedThumbnailUrl,
        routeMap: uploadedRouteMapUrl,
        country,
        location,
        duration,
        idealTime: parsedIdealTime,
        cost: cost ? Number(cost) : existingTrek.cost,
        difficultyLevel,
        trekOverview,
        trekHighlights: parsedTrekHighlights,
        highlightPicture: finalHighlightPictureUrls,
        trekInclusion: parsedTrekInclusion,
        trekExclusion: parsedTrekExclusion,
        trekItinerary: parsedTrekItinerary,
        itineraryDayPhoto: finalItineraryDayPhotoUrls,
        faq: parsedFaq,
        gallery: finalGalleryUrls,
      },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Trek updated successfully", data: updatedTrek });
  } catch (error) {
    console.error("Error editing trek:", error);
    if (error instanceof Error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

export default editTrek;
