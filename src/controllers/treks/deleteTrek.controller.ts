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
import Trek from "../../models/trek.models/trek.js";
import { deleteFile } from "../../utility/cloudinary.js";



const deleteTrek = async (req: Request, res: Response): Promise<void> => {
  try {
    const { trekId } = req.params;
    
    if (!trekId) {
    res.status(400).json({ success: false, message: "Trek ID is required" });
    return
    }

    // Find the tour and get the images
    const trek = await Trek.findById(trekId);
    if (!trek) {
    res.status(404).json({ success: false, message: "Trek not found" });
    return
    }

    // Delete the thumbnail image from Cloudinary
    if (trek.thumbnail) {
      const thumbnailPublicId = trek.thumbnail.split('/').pop()?.split('.')[0];
      if (thumbnailPublicId) {
        const deleteResult = await deleteFile(thumbnailPublicId);
        if (!deleteResult) {
        res.status(500).json({ success: false, message: "Failed to delete thumbnail image from Cloudinary" });
        return
        }
      }
    }

    // Delete all images in the gallery
    for (const image of trek.gallery) {
      const galleryPublicId = image.split('/').pop()?.split('.')[0];
      if (galleryPublicId) {
        const deleteResult = await deleteFile(galleryPublicId);
        if (!deleteResult) {
        res.status(500).json({ success: false, message: "Failed to delete gallery image from Cloudinary" });
        return
        }
      }
    }

    // Delete all highlight images
    for (const image of trek.highlightPicture) {
      const highlightPublicId = image.split('/').pop()?.split('.')[0];
      if (highlightPublicId) {
        const deleteResult = await deleteFile(highlightPublicId);
        if (!deleteResult) {
        res.status(500).json({ success: false, message: "Failed to delete highlight image from Cloudinary" });
        return
        }
      }
    }

    // Delete all itinerary day photos
    for (const image of trek.itineraryDayPhoto) {
      const itineraryPublicId = image.split('/').pop()?.split('.')[0];
      if (itineraryPublicId) {
        const deleteResult = await deleteFile(itineraryPublicId);
        if (!deleteResult) {
        res.status(500).json({ success: false, message: "Failed to delete itinerary image from Cloudinary" });
        return
        }
      }
    }

    // Now delete the tour from the database
    const deletedTrek = await Trek.findByIdAndDelete(trekId);
    if (!deletedTrek) {
    res.status(500).json({ success: false, message: "Failed to delete tour" });
    return
    }

    res.status(200).json({ success: true, message: "Trek deleted successfully" });
  } catch (error) {
    console.error("Error deleting trek and images:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default deleteTrek;
