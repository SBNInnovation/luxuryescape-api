// import { Request, Response } from "express";
// import TourTypes from "../../models/tourTypes.models/tourTypes.js";
// import { uploadFile } from "../../utility/cloudinary.js";
// import { Express } from "express";

// export interface MulterRequest extends Request {
//   file?: Express.Multer.File; // Represents the single file uploaded using multer.single()
// }


// const editTourTypes = async (req: MulterRequest, res: Response): Promise<void> => {
//   try {
//     const { tourType, description } = req.body;
//     const {tourTypeId} = req.params;

//     if(!tourTypeId){
//         res.status(404).json({success:false, message:"tourTypeID is required"});
//     }

//     if (!tourType || !description) {
//       res.status(400).json({ success: false, message: "Please provide a tour type." });
//       return;
//     }
   

//     const thumbnail = req?.file ||""; 
  
//     const uploadedThumbnail = thumbnail
//       ? 
//       // await uploadFile(thumbnail.path || "", "tours/tourTypes/images")
//       await uploadFile(`${req.file?.path}` || "", "tours/tourTypes/images")
//       : null;

//       const editTourType = await TourTypes.findByIdAndUpdate(
//         tourTypeId,
//         {
//           $set: {
//             thumbnail: uploadedThumbnail?.secure_url || "",
//             tourType,
//             slug: tourType.toLowerCase().replace(/\s+/g, "-"),
//             description,
//           },
//         },
//         { new: true } 
//       );
    
//       if(!editTourType){
//         res.status(404).json({success:false, message:"tour type not found"});
//     }
//     res.status(200).json({ success: true, message:"tour type edited successfully", data: editTourType });

//   } catch (error: unknown) {
//     console.error("Error creating blog:", error);
  
//     let errorMessage = "An unexpected error occurred.";
  
//     if (error instanceof Error) {
//       errorMessage = error.message;
//     }
  
//     res.status(500).json({ success: false, message: errorMessage });
//   }
  
// };

// export default editTourTypes;




import { Request, Response } from "express";
import TourTypes from "../../models/tourTypes.models/tourTypes.js";

import { Express } from "express";
import { deleteFile, uploadFile } from "../../utility/cloudinary.js";

export interface MulterRequest extends Request {
  file?: Express.Multer.File; // Represents the single file uploaded using multer.single()
}

const editTourTypes = async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    const { tourType, description } = req.body;
    const { tourTypeId } = req.params;

    if (!tourTypeId) {
      res.status(400).json({ success: false, message: "tourTypeId is required" });
      return;
    }

    if (!tourType || !description) {
      res.status(400).json({ success: false, message: "Please provide tourType and description." });
      return;
    }

    const existingTourType = await TourTypes.findById(tourTypeId);
    if (!existingTourType) {
      res.status(404).json({ success: false, message: "Tour type not found" });
      return;
    }

    let uploadedThumbnailUrl = existingTourType.thumbnail;

    if (req.file) {
      // Upload new thumbnail
      const uploadedThumbnail = await uploadFile(req.file.path, "tours/tourTypes/images");
      uploadedThumbnailUrl = uploadedThumbnail?.secure_url || uploadedThumbnailUrl;

      // Delete old one from Cloudinary
      if (existingTourType.thumbnail && existingTourType.thumbnail !== uploadedThumbnailUrl) {
        await deleteFile(existingTourType.thumbnail);
      }
    }

    const updatedTourType = await TourTypes.findByIdAndUpdate(
      tourTypeId,
      {
        thumbnail: uploadedThumbnailUrl,
        tourType,
        slug: tourType.toLowerCase().replace(/\s+/g, "-"),
        description,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Tour type edited successfully",
      data: updatedTourType,
    });

  } catch (error: unknown) {
    console.error("Error editing tour type:", error);

    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    res.status(500).json({ success: false, message: errorMessage });
  }
};

export default editTourTypes;
