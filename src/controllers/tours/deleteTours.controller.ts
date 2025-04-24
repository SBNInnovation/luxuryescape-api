// import { Request, Response } from "express";
// import Tour from "../../models/tours.models/tours";
// import { deleteFile } from "../../utility/cloudinary";


// const deleteTours = async(req:Request, res:Response)=>{
//     try {
//         const {tourId} = req.params;
//         if(!tourId){
//             res.status(404).json({success:false, message: "tour id is required"});
//             return;
//         }
//         const checkTour = await Tour.findById(tourId)
//         if(!checkTour){
//             res.status(404).json({success:false, message: "Tour not found"});
//             return;
//         }
//         const deleteTour = await Tour.findByIdAndDelete(tourId);
//         if(!deleteTour){
//             res.status(404).json({success:false, message: "Unable to update"});
//             return
//         }
//         res.status(200).json({success:true, message:"deleted the tour successfully"})
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({success:false, message:"Internal server error"})
//     }
// }

// export default deleteTours;

import { Request, Response } from "express";
import Tour from "../../models/tours.models/tours.js";
import { deleteFile } from "../../utility/cloudinary.js";
import deleteImageGroup from "../../utility/deleteGroupedImage.js";


const deleteTour = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tourId } = req.params;
    
    if (!tourId) {
    res.status(400).json({ success: false, message: "Tour ID is required" });
    return
    }

    // Find the tour and get the images
    const tour = await Tour.findById(tourId);
    if (!tour) {
    res.status(404).json({ success: false, message: "Tour not found" });
    return
    }

    // // Delete the thumbnail image from Cloudinary
    // if (tour.thumbnail) {
    //   const thumbnailPublicId = tour.thumbnail.split('/').pop()?.split('.')[0];
    //   if (thumbnailPublicId) {
    //     const deleteResult = await deleteFile(thumbnailPublicId);
    //     if (!deleteResult) {
    //     res.status(500).json({ success: false, message: "Failed to delete thumbnail image from Cloudinary" });
    //     return
    //     }
    //   }
    // }

    if (tour.thumbnail) {
      const fileName = tour.thumbnail.split('/').pop();         // abc123.jpg
      const publicId = fileName?.split('.')[0];                 // abc123
      const fullPublicId = `tours/thumbnail/images/${publicId}`;       // ✅ with folder
      if (fullPublicId) {
        const deleteResult = await deleteFile(fullPublicId);
        if (!deleteResult) {
          res.status(500).json({ success: false, message: "Failed to delete thumbnail image from Cloudinary" });
          return;
        }
      }
    }
    

// Delete gallery images
const galleryDeleted = await deleteImageGroup(tour.gallery, "tours/gallery/images");
if (!galleryDeleted) {
  res.status(500).json({ success: false, message: "Failed to delete gallery images" });
  return;
}

// Delete highlight images
const highlightDeleted = await deleteImageGroup(tour.highlightPicture, "tours/gallery/images");
if (!highlightDeleted) {
  res.status(500).json({ success: false, message: "Failed to delete highlight images" });
  return;
}

// Delete itinerary day photos
const itineraryDeleted = await deleteImageGroup(tour.itineraryDayPhoto, "tours/gallery/images");
if (!itineraryDeleted) {
  res.status(500).json({ success: false, message: "Failed to delete itinerary day photos" });
  return;
}

    // Now delete the tour from the database
    const deletedTour = await Tour.findByIdAndDelete(tourId);
    if (!deletedTour) {
    res.status(500).json({ success: false, message: "Failed to delete tour" });
    return
    }

    res.status(200).json({ success: true, message: "Tour deleted successfully" });
  } catch (error) {
    console.error("Error deleting tour and images:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default deleteTour;
