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

    if (tour?.thumbnail) {
      await deleteFile(tour.thumbnail)
    }
    

// Delete gallery images
// const galleryDeleted = await deleteImageGroup(tour.gallery, "tours/gallery/images");
    for (const url of tour.gallery) {
      await deleteFile(url);
    }
// if (!galleryDeleted) {
//   res.status(500).json({ success: false, message: "Failed to delete gallery images" });
//   return;
// }

// Delete highlight images
// const highlightDeleted = await deleteImageGroup(tour.highlightPicture, "tours/gallery/images");
 for (const url of tour.highlightPicture) {
      await deleteFile(url);
    }
// if (!highlightDeleted) {
//   res.status(500).json({ success: false, message: "Failed to delete highlight images" });
//   return;
// }

// Delete itinerary day photos
// const itineraryDeleted = await deleteImageGroup(tour.itineraryDayPhoto, "tours/gallery/images");
 for (const url of tour.itineraryDayPhoto) {
      await deleteFile(url);
    }
// if (!itineraryDeleted) {
//   res.status(500).json({ success: false, message: "Failed to delete itinerary day photos" });
//   return;
// }

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
