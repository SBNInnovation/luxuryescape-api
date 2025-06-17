import { Request, Response } from "express";
import FineDining from "../../models/fine-dining.models/fine-dining.js";
import Tour from "../../models/tours.models/tours.js";
import Trek from "../../models/trek.models/trek.js";
import { deleteFile } from "../../utility/cloudinary.js";



const deleteFineDining = async (req: Request, res: Response): Promise<void> => {
  try {
    const fineDiningId = req.params.fineDiningId;
    if (!fineDiningId) {
      res.status(400).json({ success: false, message: "Accommodation ID is required" });
      return;
    }

    // Find the accommodation and get the images
    const accommodation = await FineDining.findById(fineDiningId);
    if (!accommodation) {
      res.status(404).json({ success: false, message: "Accommodation not found" });
      return;
    }
    // Remove references from Tours
    await Tour.updateMany({ fineDining: fineDiningId }, { $pull: { fineDining: fineDiningId } });

    // Remove references from Treks
    await Trek.updateMany({ accommodations: fineDiningId }, { $pull: { accommodations: fineDiningId }});


    // const deletedAccommodationPics = await deleteImageGroup(accommodation.accommodationPics, "tours/accommodation/images");
     if (accommodation && accommodation.pics && accommodation.pics.length > 0) {
                accommodation.pics.map(async (image) => {
                  await deleteFile(image)
                })
              }
    // if (!deletedAccommodationPics) {
    //   res.status(500).json({ success: false, message: "Failed to delete itinerary day photos" });
    //   return;
    // }

    // Now delete the accommodation from the database
    const deletedAccommodation = await FineDining.findByIdAndDelete(fineDiningId);
    if (!deletedAccommodation) {
      res.status(500).json({ success: false, message: "Failed to delete fineDining" });
      return;
    }

    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting fine dining and images:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export default deleteFineDining;
