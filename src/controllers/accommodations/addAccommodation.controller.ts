// import { Request, Response } from "express";
// import { uploadFile } from "../../utility/cloudinary.js";
// import { Express } from "express";
// import Accommodation from "../../models/accommodation.models/Accommodation.js";

// export interface MulterRequest extends Request {
//     files?: {
//       accommodationPics?: Express.Multer.File[];
//       roomPhotos?: Express.Multer.File[];
//     };
//   }

// const addAccomodation = async(req:MulterRequest, res:Response):Promise<void> =>{
//     try {
//         const {
//             accommodationTitle,
//             accommodationLocation,
//             accommodationRating,
//             accommodationDescription,
//             accommodationFeatures,
//             accommodationAmenities,
//             rooms
//         } = req.body;

//         if(
//             !accommodationTitle ||
//             !accommodationLocation ||
//             !accommodationRating ||
//             !accommodationDescription ||
//             !accommodationFeatures ||
//             !accommodationAmenities ||
//             !rooms
//         ){
//             res.status(404).json({success:false, message: "Please fill in all fields."});
//             return;
//         }

//         const accommodationPics = req?.files?.accommodationPics || [];
//         const roomPhotos = req?.files?.roomPhotos || [];

//         const uploadedAccommodationPics = accommodationPics.length
//         ? await Promise.all(accommodationPics.map((file) => uploadFile(file?.path || "", "tours/accommodation/images")))
//         : [];
//         const uploadedRoomPhotos = roomPhotos.length
//         ? await Promise.all(roomPhotos.map((file) => uploadFile(file?.path || "", "tours/accommodation/rooms/images")))
//         : [];
      
//         // const parsedRooms = JSON.parse(rooms)

//         const accommodation = await Accommodation.create({
//             accommodationTitle,
//             accommodationLocation,
//             accommodationRating,
//             accommodationDescription,
//             accommodationFeatures,
//             accommodationAmenities,
//             // rooms:parsedRooms,
//             rooms,
//             accommodationPics: uploadedAccommodationPics.map((file) => file?.secure_url) || [],
//             roomPhotos: uploadedRoomPhotos.map((file) =>file?.secure_url) || [],
//         });

//         if(!accommodation){
//             res.status(404).json({success:false, message: "Failed to create accommodation."})
//             return;
//         }
//         res.status(201).json({success:true, message: "Accommodation created successfully",accommodation})
        
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({success:false, message: "Internal Server Error."})
//         return
//     }
// }

// export default addAccomodation;


// import { Request, Response } from "express";
// import { uploadFile } from "../../utility/cloudinary.js";
// import { Express } from "express";
// import Accommodation from "../../models/accommodation.models/Accommodation.js";

// export interface MulterRequest extends Request {
//   files?: {
//     accommodationPics?: Express.Multer.File[];
//     roomPhotos?: Express.Multer.File[];
//   };
// }

// const addAccommodation = async (req: MulterRequest, res: Response): Promise<void> => {
//   try {
//     const {
//       accommodationTitle,
//       accommodationLocation,
//       accommodationRating,
//       accommodationDescription,
//       accommodationFeatures,
//       accommodationAmenities,
//       rooms,
//     } = req.body;

//     // Validate required fields
//     if (!accommodationTitle || !accommodationLocation || !accommodationRating || !accommodationDescription) {
//       res.status(400).json({ success: false, message: "Missing required fields." });
//       return;
//     }

//     const parsedAccommodationAmenities = accommodationAmenities? JSON.parse(accommodationAmenities) : []

//     const parsedAccommodationFeatures = accommodationFeatures? JSON.parse(accommodationFeatures) : [];

//     if (!Array.isArray(parsedAccommodationAmenities) || !Array.isArray(parsedAccommodationFeatures)) {
//       res.status(400).json({ success: false, message: "Features and amenities must be arrays." });
//       return;
//     }

//     const parsedRooms = rooms ? JSON.parse(rooms) : [];
//     const validRooms = Array.isArray(parsedRooms)

//     // const validRooms = Array.isArray(parsedRooms) && parsedRooms.every((room) =>
//     //   room.roomTitle && room.roomStandard && room.roomDescription && Array.isArray(room.roomFacilities)
//     // );

//     if (!validRooms) {
//       res.status(400).json({ success: false, message: "Invalid room data provided." });
//       return;
//     }

//     const accommodationPics = req?.files?.accommodationPics || [];
//     const roomPhotos = req?.files?.roomPhotos || [];

//     // Upload photos to Cloudinary
//     // const uploadedAccommodationPics = accommodationPics.length
//     //   ? await Promise.all(
//     //       accommodationPics.map(async (file) => {
//     //         try {
//     //           return await uploadFile(file?.path || "", "tours/accommodation/images");
//     //         } catch (error) {
//     //           console.error("Error uploading accommodation pic:", error);
//     //           return null;
//     //         }
//     //       })
//     //     )
//     //   : [];

//     // const uploadedRoomPhotos = roomPhotos.length
//     //   ? await Promise.all(
//     //       roomPhotos.map(async (file) => {
//     //         try {
//     //           return await uploadFile(file?.path || "", "tours/accommodation/rooms/images");
//     //         } catch (error) {
//     //           console.error("Error uploading room photo:", error);
//     //           return null;
//     //         }
//     //       })
//     //     )
//     //   : [];

//     const uploadedAccommodationPics = accommodationPics.length    
//   ? await Promise.all(accommodationPics.map((file) => uploadFile(file?.path || "", "tours/accommodation/images")))
//         : [];
//         const uploadedRoomPhotos = roomPhotos.length
//         ? await Promise.all(roomPhotos.map((file) => uploadFile(file?.path || "", "tours/accommodation/rooms/images")))
//         : [];
//     // Create accommodation document
//     const accommodation = await Accommodation.create({
//       accommodationTitle,
//       accommodationLocation,
//       accommodationRating,
//       accommodationDescription,
//       accommodationFeatures : parsedAccommodationFeatures,
//       accommodationAmenities: parsedAccommodationAmenities,
//       // rooms,
//       rooms: parsedRooms,
//       accommodationPics: uploadedAccommodationPics.map((file) => file?.secure_url) || [],
//       roomPhotos: uploadedRoomPhotos.map((file) =>file?.secure_url) || [],
//     });

//     if (!accommodation) {
//       res.status(500).json({ success: false, message: "Failed to create accommodation." });
//       return;
//     }

//     res.status(201).json({ success: true, message: "Accommodation created successfully", accommodation });
//   } catch (error) {
//     console.error("Error creating accommodation:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error." });
//   }
// };

// export default addAccommodation;

import { Request, Response } from "express";
import { uploadFile } from "../../utility/cloudinary.js";
import { Express } from "express";
import Accommodation from "../../models/accommodation.models/Accommodation.js";

export interface MulterRequest extends Request {
  files?: {
    accommodationPics?: Express.Multer.File[];
    roomPhotos?: Express.Multer.File[];
  };
}

const addAccommodation = async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    const {
      accommodationTitle,
      accommodationLocation,
      accommodationRating,
      accommodationDescription,
      accommodationFeatures,
      accommodationAmenities,
      rooms,
    } = req.body;

    // Validate required fields
    if (!accommodationTitle || !accommodationLocation || !accommodationRating || !accommodationDescription) {
      res.status(400).json({ success: false, message: "Missing required fields." });
      return;
    }

    const parsedAccommodationAmenities = typeof accommodationAmenities === "string"
      ? JSON.parse(accommodationAmenities)
      : accommodationAmenities || [];

    const parsedAccommodationFeatures = typeof accommodationFeatures === "string"
      ? JSON.parse(accommodationFeatures)
      : accommodationFeatures || [];

    const parsedRooms = typeof rooms === "string" ? JSON.parse(rooms) : rooms || [];
    
    if (!Array.isArray(parsedAccommodationAmenities) || !Array.isArray(parsedAccommodationFeatures) || !Array.isArray(parsedRooms)) {
      res.status(400).json({ success: false, message: "Features, amenities, and rooms must be arrays." });
      return;
    }

    const accommodationPicsFiles = req?.files?.accommodationPics || [];
    const uploadedAccommodationPics = accommodationPicsFiles.length
      ? await Promise.all(accommodationPicsFiles.map((file) => uploadFile(file?.path || "", "tours/accommodation/images")))
      : [];

    const roomPhotosFiles = req?.files?.roomPhotos || [];
    const uploadedRoomPhotos = roomPhotosFiles.length
      ? await Promise.all(roomPhotosFiles.map((file) => uploadFile(file?.path || "", "tours/accommodation/rooms/images")))
      : [];

    // Extract file URLs from Cloudinary upload results
    const accommodationPics = uploadedAccommodationPics.length
      ? uploadedAccommodationPics.map((file) => file?.secure_url)
      : req.body.accommodationPics || []; // Use existing URLs if no files uploaded

    const updatedRooms = parsedRooms.map((room, index) => ({
      ...room,
      roomPhotos: uploadedRoomPhotos.length ? uploadedRoomPhotos.map((file) => file?.secure_url) : room.roomPhotos || [],
    }));

    // Create accommodation document
    const accommodation = await Accommodation.create({
      accommodationTitle,
      accommodationLocation,
      accommodationRating,
      accommodationDescription,
      accommodationFeatures: parsedAccommodationFeatures,
      accommodationAmenities: parsedAccommodationAmenities,
      rooms: updatedRooms,
      accommodationPics,
    });

    if (!accommodation) {
      res.status(500).json({ success: false, message: "Failed to create accommodation." });
      return;
    }

    res.status(201).json({ success: true, message: "Accommodation created successfully", accommodation });
  } catch (error) {
    console.error("Error creating accommodation:", error);
    res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};

export default addAccommodation;

