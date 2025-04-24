import { Request, Response } from "express";
import Trek from "../../models/trek.models/trek.js";
import { deleteFile } from "../../utility/cloudinary.js";
import deleteImageGroup from "../../utility/deleteGroupedImage.js";



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

    if (trek.thumbnail) {
      const fileName = trek.thumbnail.split('/').pop();         // abc123.jpg
      const publicId = fileName?.split('.')[0];                 // abc123
      const fullPublicId = `treks/thumbnail/images/${publicId}`;       // ✅ with folder
      if (fullPublicId) {
        const deleteResult = await deleteFile(fullPublicId);
        if (!deleteResult) {
          res.status(500).json({ sueccess: false, message: "Failed to delete thumbnail image from Cloudinary" });
          return;
        }
      }
    }

    if (trek.routeMap) {
      const fileName = trek.routeMap.split('/').pop();         // abc123.jpg
      const publicId = fileName?.split('.')[0];                 // abc123
      const fullPublicId = `treks/route-map/images/${publicId}`;       // ✅ with folder
      if (fullPublicId) {
        const deleteResult = await deleteFile(fullPublicId);
        if (!deleteResult) {
          res.status(500).json({ sueccess: false, message: "Failed to delete route map from Cloudinary" });
          return;
        }
      }
    }

    // Delete gallery images
    const galleryDeleted = await deleteImageGroup(trek.gallery, "treks/gallery/images");
    if (!galleryDeleted) {
      res.status(500).json({ success: false, message: "Failed to delete gallery images" });
      return;
    }
    
    // Delete highlight images
    const highlightDeleted = await deleteImageGroup(trek.highlightPicture, "treks/gallery/images");
    if (!highlightDeleted) {
      res.status(500).json({ success: false, message: "Failed to delete highlight images" });
      return;
    }
    
    // Delete itinerary day photos
    const itineraryDeleted = await deleteImageGroup(trek.itineraryDayPhoto, "treks/gallery/images");
    if (!itineraryDeleted) {
      res.status(500).json({ success: false, message: "Failed to delete itinerary day photos" });
      return;
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
