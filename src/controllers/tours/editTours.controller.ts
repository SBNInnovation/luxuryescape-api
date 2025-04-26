import { Request, Response } from "express";
import slug from "slug";
import Tour from "../../models/tours.models/tours.js";
import {  deleteFile, uploadFile} from "../../utility/cloudinary.js";
// import deleteImageGroup from "../../utility/deleteGroupedImage.js";

export interface MulterRequest extends Request {
  files?: {
    thumbnail?: Express.Multer.File[];
    // routeMap?: Express.Multer.File[];
    gallery?: Express.Multer.File[];
    highlightPicture?: Express.Multer.File[];
    itineraryDayPhoto?: Express.Multer.File[];
  };
}

const editTour = async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    const { tourId } = req.params;
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
      country,
      galleryToDelete,
      highlightPictureToDelete,
      itineraryDayPhotoToDelete,
    } = req.body;

    if (!tourId) {
      res.status(400).json({ success: false, message: "Tour ID is required" });
      return;
    }

    const existingTour = await Tour.findById(tourId);
    if (!existingTour) {
      res.status(404).json({ success: false, message: "Tour not found" });
      return;
    }

    if (cost && (isNaN(cost) || cost <= 0)) {
      res.status(400).json({ success: false, message: "Cost must be a valid positive number" });
      return;
    }

    // HANDLE IMAGE DELETION ARRAYS FROM req.body
    const parseDeleteArray = (data: any) => {
      try {
        return data ? JSON.parse(data) : [];
      } catch {
        return [];
      }
    };

    const parsedGalleryToDelete = parseDeleteArray(galleryToDelete);
    const parsedHighlightToDelete = parseDeleteArray(highlightPictureToDelete);
    const parsedItineraryPhotoToDelete = parseDeleteArray(itineraryDayPhotoToDelete);

    //FILE UPLOADS
    const thumbnail = req?.files?.thumbnail ||[]; 
      const gallery = req?.files?.gallery || [];
      const highlightPicture = req?.files?.highlightPicture || [];
      const itineraryDayPhoto = req?.files?.itineraryDayPhoto || [];

    const uploadedThumbnail = thumbnail.length
      ? await uploadFile(thumbnail[0]?.path || "", "tours/thumbnail/images")
      : null;
    const uploadedThumbnailUrl = uploadedThumbnail?.secure_url || existingTour.thumbnail;

    const uploadedGallery = gallery.length
      ? await Promise.all(gallery.map(file => uploadFile(file?.path || "", "tours/gallery/images")))
      : [];
    const uploadedGalleryUrls = uploadedGallery.map(file => file?.secure_url).filter(Boolean);

    const uploadedHighlight = highlightPicture.length
      ? await Promise.all(highlightPicture.map(file => uploadFile(file?.path || "", "tours/gallery/images")))
      : [];
    const uploadedHighlightUrls = uploadedHighlight.map(file => file?.secure_url).filter(Boolean);

    const uploadedItineraryPhotos = itineraryDayPhoto.length
      ? await Promise.all(itineraryDayPhoto.map(file => uploadFile(file?.path || "", "tours/gallery/images")))
      : [];
    const uploadedItineraryPhotoUrls = uploadedItineraryPhotos.map(file => file?.secure_url).filter(Boolean);

    //CLEAN IMAGE LISTS
    const finalGallery = [
      ...existingTour.gallery.filter((img: string) => !parsedGalleryToDelete.includes(img)),
      ...uploadedGalleryUrls,
    ];


    const finalHighlightPictures = [
      ...existingTour.highlightPicture.filter((img: string) => !parsedHighlightToDelete.includes(img)),
      ...uploadedHighlightUrls,
    ];

    const finalItineraryPhotos = [
      ...existingTour.itineraryDayPhoto.filter((img: string) => !parsedItineraryPhotoToDelete.includes(img)),
      ...uploadedItineraryPhotoUrls,
    ];

    // const matchedImages = [
    // existingTour.itineraryDayPhoto.filter((img: string, index) => parsedItineraryPhotoToDelete.includes(img, index)),
    // ]

    // const indexes = matchedImages.map((url:string))

    // uploadedItineraryPhotoUrls = matchedImages[]
    
    // // Push any leftover uploaded images (extra new days maybe)
    // const validUploadedPhotos = uploadedItineraryPhotoUrls.filter((url): url is string => typeof url === 'string');
    // if (validUploadedPhotos.length > 0) {
    //   finalItineraryPhotos.push(...validUploadedPhotos);
    // }

    //DELETE FROM CLOUDINARY
    const allToDelete = [
      ...parsedGalleryToDelete,
      ...parsedHighlightToDelete,
      ...parsedItineraryPhotoToDelete,
    ];

    for (const url of allToDelete) {
      await deleteFile(url);
    }

    // === JSON FIELD PARSING ===
    const parseJsonSafe = (data: any, fallback: any) => {
      if (Array.isArray(data)) return data;
      try {
        return JSON.parse(data);
      } catch {
        return fallback;
      }
    };

    const parsedIdealTime = idealTime ? parseJsonSafe(idealTime, existingTour.idealTime) : existingTour.idealTime;
    const parsedTourItinerary = tourItinerary ? parseJsonSafe(tourItinerary, existingTour.tourItinerary) : existingTour.tourItinerary;
    const parsedFaq = faq ? parseJsonSafe(faq, existingTour.faq) : existingTour.faq;
    const parsedTourInclusion = tourInclusion ? parseJsonSafe(tourInclusion, existingTour.tourInclusion) : existingTour.tourInclusion;
    const parsedTourExclusion = tourExclusion ? parseJsonSafe(tourExclusion, existingTour.tourExclusion) : existingTour.tourExclusion;
    const parsedTourHighlights = tourHighlights ? parseJsonSafe(tourHighlights, existingTour.tourHighlights) : existingTour.tourHighlights;

    const slug1 = tourName ? slug(tourName) : existingTour.slug;

    // === UPDATE TOUR ===
    const updatedTour = await Tour.findByIdAndUpdate(
      tourId,
      {
        tourName,
        slug: slug1,
        thumbnail: uploadedThumbnailUrl,
        country,
        location,
        duration,
        idealTime: parsedIdealTime,
        cost: cost ? Number(cost) : existingTour.cost,
        tourTypes,
        tourOverview,
        tourHighlights: parsedTourHighlights,
        highlightPicture: finalHighlightPictures,
        tourInclusion: parsedTourInclusion,
        tourExclusion: parsedTourExclusion,
        tourItinerary: parsedTourItinerary,
        itineraryDayPhoto: finalItineraryPhotos,
        faq: parsedFaq,
        gallery: finalGallery,
      },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Tour updated successfully", data: updatedTour });
  } catch (error) {
    console.error("Error editing tour:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export default editTour;







// import type { Request, Response } from "express"
// import slug from "slug"
// import Tour from "../../models/tours.models/tours.js"
// import { uploadFile } from "../../utility/cloudinary.js"
// import deleteImageGroup from "../../utility/deleteGroupedImage.js"

// export interface MulterRequest extends Request {
//   files?: {
//     thumbnail?: Express.Multer.File[]
//     // routeMap?: Express.Multer.File[];
//     gallery?: Express.Multer.File[]
//     highlightPicture?: Express.Multer.File[]
//     itineraryDayPhoto?: Express.Multer.File[]
//   }
// }

// const editTour = async (req: MulterRequest, res: Response): Promise<void> => {
//   try {
//     const { tourId } = req.params
//     const {
//       tourName,
//       duration,
//       idealTime,
//       cost,
//       tourTypes,
//       tourOverview,
//       tourHighlights,
//       tourInclusion,
//       tourExclusion,
//       tourItinerary,
//       faq,
//       location,
//       country,
//       galleryToDelete,
//       highlightPictureToDelete,
//       itineraryDayPhotoToDelete,
//     } = req.body

//     if (!tourId) {
//       res.status(400).json({ success: false, message: "Tour ID is required" })
//       return
//     }

//     const existingTour = await Tour.findById(tourId)
//     if (!existingTour) {
//       res.status(404).json({ success: false, message: "Tour not found" })
//       return
//     }

//     if (cost && (isNaN(cost) || cost <= 0)) {
//       res.status(400).json({ success: false, message: "Cost must be a valid positive number" })
//       return
//     }

//     // === HANDLE IMAGE DELETION ARRAYS FROM req.body ===
//     const parseDeleteArray = (data: any) => {
//       try {
//         return data ? JSON.parse(data) : []
//       } catch {
//         return []
//       }
//     }

//     const parsedGalleryToDelete = parseDeleteArray(galleryToDelete)
//     const parsedHighlightToDelete = parseDeleteArray(highlightPictureToDelete)
//     // const parsedItineraryPhotoToDelete = parseDeleteArray(itineraryDayPhotoToDelete);

//     // === FILE UPLOADS ===
//     const thumbnail = req?.files?.thumbnail || []
//     const gallery = req?.files?.gallery || []
//     const highlightPicture = req?.files?.highlightPicture || []
//     const itineraryDayPhoto = req?.files?.itineraryDayPhoto || []

//     const uploadedThumbnail = thumbnail.length
//       ? await uploadFile(thumbnail[0]?.path || "", "tours/thumbnail/images")
//       : null
//     const uploadedThumbnailUrl = uploadedThumbnail?.secure_url || existingTour.thumbnail

//     const uploadedGallery = gallery.length
//       ? await Promise.all(gallery.map((file) => uploadFile(file?.path || "", "tours/gallery/images")))
//       : []
//     const uploadedGalleryUrls = uploadedGallery.map((file) => file?.secure_url).filter(Boolean)

//     const uploadedHighlight = highlightPicture.length
//       ? await Promise.all(highlightPicture.map((file) => uploadFile(file?.path || "", "tours/gallery/images")))
//       : []
//     const uploadedHighlightUrls = uploadedHighlight.map((file) => file?.secure_url).filter(Boolean)

//     const uploadedItineraryPhotos = itineraryDayPhoto.length
//       ? await Promise.all(itineraryDayPhoto.map((file) => uploadFile(file?.path || "", "tours/gallery/images")))
//       : []
//     const uploadedItineraryPhotoUrls = uploadedItineraryPhotos.map((file) => file?.secure_url).filter(Boolean)

//     //CLEAN IMAGE LISTS
//     const finalGallery = [
//       ...existingTour.gallery.filter((img: string) => !parsedGalleryToDelete.includes(img)),
//       ...uploadedGalleryUrls,
//     ]

//     const finalHighlightPictures = [
//       ...existingTour.highlightPicture.filter((img: string) => !parsedHighlightToDelete.includes(img)),
//       ...uploadedHighlightUrls,
//     ]

//     // The current implementation:
//     // const finalItineraryPhotos = [
//     //   ...existingTour.itineraryDayPhoto.filter((img: string) => !parsedItineraryPhotoToDelete.includes(img)),
//     //   ...uploadedItineraryPhotoUrls,
//     // ];

//     // Replace with this improved implementation:
//     const finalItineraryPhotos = [...existingTour.itineraryDayPhoto]

//     // Parse the itineraryDayPhotoToDelete as an array of objects with day index and URL
//     // Format expected: [{index: 0, url: "http://..."}, {index: 2, url: "http://..."}]
//     const parsedItineraryPhotoToDelete = parseDeleteArray(itineraryDayPhotoToDelete)

//     // Create a map to track which days have new photos
//     const dayPhotoReplacements = new Map()

//     // Process the delete/replace operations
//     parsedItineraryPhotoToDelete.forEach((item: { index: number; url: string }) => {
//       const { index, url } = item

//       // Validate the index is within bounds
//       if (index >= 0 && index < finalItineraryPhotos.length) {
//         // Mark this index for replacement and store the URL being replaced
//         dayPhotoReplacements.set(index, url)
//       }
//     })

//     // Replace photos at the specified indices with new uploads
//     let uploadIndex = 0
//     dayPhotoReplacements.forEach((oldUrl, dayIndex) => {
//       // If we have a new photo to use as replacement
//       if (uploadIndex < uploadedItineraryPhotoUrls.length) {
//         const newPhotoUrl = uploadedItineraryPhotoUrls[uploadIndex]
//         // Only assign if the new URL is defined
//         if (newPhotoUrl) {
//           finalItineraryPhotos[dayIndex] = newPhotoUrl
//           uploadIndex++
//         }
//       }
//     })

//     // Add any remaining uploaded photos to the end - filter out undefined values
//     if (uploadIndex < uploadedItineraryPhotoUrls.length) {
//       const remainingPhotos = uploadedItineraryPhotoUrls
//         .slice(uploadIndex)
//         .filter((url): url is string => typeof url === "string")
//       finalItineraryPhotos.push(...remainingPhotos)
//     }

//     // Ensure we're only deleting the URLs that were actually replaced
//     const itineraryPhotosToDelete = Array.from(dayPhotoReplacements.values())

//     //DELETE FROM CLOUDINARY
//     const allToDelete = [
//       ...parsedGalleryToDelete,
//       ...parsedHighlightToDelete,
//       ...itineraryPhotosToDelete, // Use the new variable instead of parsedItineraryPhotoToDelete
//     ]

//     for (const url of allToDelete) {
//       await deleteImageGroup(url, "tours/gallery/images")
//     }

//     // === JSON FIELD PARSING ===
//     const parseJsonSafe = (data: any, fallback: any) => {
//       if (Array.isArray(data)) return data
//       try {
//         return JSON.parse(data)
//       } catch {
//         return fallback
//       }
//     }

//     const parsedIdealTime = idealTime ? parseJsonSafe(idealTime, existingTour.idealTime) : existingTour.idealTime
//     const parsedTourItinerary = tourItinerary
//       ? parseJsonSafe(tourItinerary, existingTour.tourItinerary)
//       : existingTour.tourItinerary
//     const parsedFaq = faq ? parseJsonSafe(faq, existingTour.faq) : existingTour.faq
//     const parsedTourInclusion = tourInclusion
//       ? parseJsonSafe(tourInclusion, existingTour.tourInclusion)
//       : existingTour.tourInclusion
//     const parsedTourExclusion = tourExclusion
//       ? parseJsonSafe(tourExclusion, existingTour.tourExclusion)
//       : existingTour.tourExclusion
//     const parsedTourHighlights = tourHighlights
//       ? parseJsonSafe(tourHighlights, existingTour.tourHighlights)
//       : existingTour.tourHighlights

//     const slug1 = tourName ? slug(tourName) : existingTour.slug

//     // === UPDATE TOUR ===
//     const updatedTour = await Tour.findByIdAndUpdate(
//       tourId,
//       {
//         tourName,
//         slug: slug1,
//         thumbnail: uploadedThumbnailUrl,
//         country,
//         location,
//         duration,
//         idealTime: parsedIdealTime,
//         cost: cost ? Number(cost) : existingTour.cost,
//         tourTypes,
//         tourOverview,
//         tourHighlights: parsedTourHighlights,
//         highlightPicture: finalHighlightPictures,
//         tourInclusion: parsedTourInclusion,
//         tourExclusion: parsedTourExclusion,
//         tourItinerary: parsedTourItinerary,
//         itineraryDayPhoto: finalItineraryPhotos,
//         faq: parsedFaq,
//         gallery: finalGallery,
//       },
//       { new: true },
//     )

//     res.status(200).json({ success: true, message: "Tour updated successfully", data: updatedTour })
//   } catch (error) {
//     console.error("Error editing tour:", error)
//     res.status(500).json({
//       success: false,
//       message: error instanceof Error ? error.message : "Unknown error",
//     })
//   }
// }

// export default editTour
