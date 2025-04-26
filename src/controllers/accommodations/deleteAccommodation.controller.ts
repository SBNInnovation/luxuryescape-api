// import { Request, Response } from "express";
// import Accommodation from "../../models/accommodation.models/Accommodation.js";

// const deleteAccommodation = async(req:Request, res:Response):Promise<void> =>{
//     try {
//         const accommodationId = req.params.accommodationId;
//         if(!accommodationId){
//             res.status(400).json({success:false, message: "Accommodation ID is required"});
//             return
//         }

//         const deleteAcco = await Accommodation.findByIdAndDelete(accommodationId);
//         if(!deleteAcco){
//             res.status(404).json({success:false, message: "Accommodation not found"})
//             return
//         }
//         res.status(200).json({success:true, message: "Accommodation deleted successfully"})

//     } catch (error) {
//         console.log(error)
//         if(error instanceof(Error)){
//             res.status(500).json({success:false, message: error.message})
//             return
//         }
//     }
// }

// export default deleteAccommodation;


import { Request, Response } from "express";
import Accommodation from "../../models/accommodation.models/Accommodation.js";
import Tour from "../../models/tours.models/tours.js";
import Trek from "../../models/trek.models/trek.js";
import Room from "../../models/rooms.models/room.js";
import { deleteFile } from "../../utility/cloudinary.js";

// import deleteImageGroup from "../../utility/deleteGroupedImage.js";


const deleteAccommodation = async (req: Request, res: Response): Promise<void> => {
  try {
    const accommodationId = req.params.accommodationId;
    if (!accommodationId) {
      res.status(400).json({ success: false, message: "Accommodation ID is required" });
      return;
    }

    // Find the accommodation and get the images
    const accommodation = await Accommodation.findById(accommodationId);
    if (!accommodation) {
      res.status(404).json({ success: false, message: "Accommodation not found" });
      return;
    }
    // Remove references from Tours
    await Tour.updateMany({ accommodations: accommodationId }, { $pull: { accommodations: accommodationId }});

    // Remove references from Treks
    await Trek.updateMany({ accommodations: accommodationId }, { $pull: { accommodations: accommodationId }});

    await Room.updateMany({accommodations: accommodationId}, {$pull:{accommodations: accommodationId }});

    // Delete all accommodation images from Cloudinary
    // if (accommodation.accommodationPics && accommodation.accommodationPics.length > 0) {
    //   for (const image of accommodation.accommodationPics) {
    //     const imagePublicId = image.split('/').pop()?.split('.')[0]; // Extract public ID from the URL
    //     if (imagePublicId) {
    //       const deleteResult = await deleteFile(imagePublicId);
    //       if (!deleteResult) {
    //         res.status(500).json({ success: false, message: "Failed to delete some images from Cloudinary" });
    //         return;
    //       }
    //     }
    //   }
    // }

    // const deletedAccommodationPics = await deleteImageGroup(accommodation.accommodationPics, "tours/accommodation/images");
     if (accommodation && accommodation.accommodationPics && accommodation.accommodationPics.length > 0) {
                accommodation.accommodationPics.map(async (image) => {
                  await deleteFile(image)
                })
              }
    // if (!deletedAccommodationPics) {
    //   res.status(500).json({ success: false, message: "Failed to delete itinerary day photos" });
    //   return;
    // }

    // Now delete the accommodation from the database
    const deletedAccommodation = await Accommodation.findByIdAndDelete(accommodationId);
    if (!deletedAccommodation) {
      res.status(500).json({ success: false, message: "Failed to delete accommodation" });
      return;
    }

    res.status(200).json({ success: true, message: "Accommodation deleted successfully" });
  } catch (error) {
    console.error("Error deleting accommodation and images:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export default deleteAccommodation;
