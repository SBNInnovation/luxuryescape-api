// import { Request, Response } from "express";
// import slug from "slug";
// import { uploadFile } from "../../utility/cloudinary.js";
// import Room from "../../models/rooms.models/room.js";

// export interface MulterRequest extends Request {
//   files?: {
//     roomPhotos?: Express.Multer.File[];
//   };
// }

// const editRoom = async (req: MulterRequest, res: Response): Promise<void> => {
//   try {
//     const { roomId } = req.params; // Get roomId from request params
//     const {
//       roomTitle,
//       roomStandard,
//       roomDescription,
//       roomFacilities,
//       accommodation,
//     } = req.body;

//     // Validate required fields
//     if (!roomTitle || !roomStandard || !roomDescription || !roomFacilities || !accommodation) {
//       res.status(400).json({ success: false, message: "Please fill in all fields" });
//       return;
//     }

//     // Parse facilities JSON string if needed
//     const parsedFacilities = typeof roomFacilities === "string" ? JSON.parse(roomFacilities) : roomFacilities || [];

//     // Handle file uploads using Multer
//     const roomPhotos = req?.files?.roomPhotos || [];

//     // Upload new room photos to Cloudinary
//     const uploadedRoomPhotos = roomPhotos.length
//       ? await Promise.all(
//           roomPhotos.map(async (file) => {
//             try {
//               const uploaded = await uploadFile(file?.path || "", "tours/accommodation/rooms/images");
//               return uploaded?.secure_url || null;
//             } catch (error) {
//               console.error("Error uploading room photo:", error);
//               return null;
//             }
//           })
//         )
//       : [];

//     // Remove null values if any upload failed
//     const filteredRoomPhotos = uploadedRoomPhotos.filter((url) => url !== null);

//     // Generate slug from title
//     const slug1 = slug(roomTitle);

//     // Find the room by ID and update it
//     const updatedRoom = await Room.findByIdAndUpdate(
//       roomId,
//       {
//         roomTitle,
//         slug: slug1,
//         roomStandard,
//         roomDescription,
//         roomFacilities: parsedFacilities,
//         accommodation,
//         ...(filteredRoomPhotos.length > 0 && { roomPhotos: filteredRoomPhotos }), // Only update photos if new ones are provided
//       },
//       { new: true }
//     );

//     if (!updatedRoom) {
//       res.status(404).json({ success: false, message: "Room not found" });
//       return;
//     }

//     res.status(200).json({ success: true, message: "Room updated successfully", data: updatedRoom });
//   } catch (error) {
//     console.error("Error editing room:", error);
//     if (error instanceof Error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   }
// };

// export default editRoom;




import { Request, Response } from "express";
import slug from "slug";
import Room from "../../models/rooms.models/room.js";
import { deleteFile, uploadFile } from "../../utility/cloudinary.js";

// import deleteImageGroup from "../../utility/deleteGroupedImage.js";

export interface MulterRequest extends Request {
  files?: {
    roomPhotos?: Express.Multer.File[];
  };
}

const editRoom = async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    const { roomId } = req.params;
    const {
      roomTitle,
      roomStandard,
      roomDescription,
      roomFacilities,
      accommodation,
      imagesToDelete,
    } = req.body;

    if (!roomId) {
      res.status(400).json({ success: false, message: "Room ID is required" });
      return;
    }

    // if (!roomTitle || !roomStandard || !roomDescription || !roomFacilities || !accommodation) {
    //   res.status(400).json({ success: false, message: "Please fill in all fields" });
    //   return;
    // }

    // Find existing room
    const existingRoom = await Room.findById(roomId);
    if (!existingRoom) {
      res.status(404).json({ success: false, message: "Room not found" });
      return;
    }

    // Parse facilities
    let parsedFacilities: string[] = [];
    try {
      parsedFacilities = typeof roomFacilities === "string" ? JSON.parse(roomFacilities) : roomFacilities;
      if (!Array.isArray(parsedFacilities)) throw new Error("Invalid facilities format");
    } catch (error) {
      res.status(400).json({ success: false, message: "Invalid format for roomFacilities" });
      return;
    }

    // Parse images to delete
    let parsedImagesToDelete = [];
    try {
      parsedImagesToDelete = imagesToDelete ? JSON.parse(imagesToDelete) : [];
      if (!Array.isArray(parsedImagesToDelete)) throw new Error("Invalid imagesToDelete format");
    } catch (err) {
      res.status(400).json({ success: false, message: "Invalid format for imagesToDelete" });
      return;
    }

    // Upload new photos
    const roomPhotos = req?.files?.roomPhotos || [];
    const uploadedPhotos = roomPhotos.length
      ? await Promise.all(roomPhotos.map(file => uploadFile(file?.path || "", "tours/accommodation/rooms/images")))
      : [];

    const uploadedPhotoUrls = uploadedPhotos
      .map(photo => photo?.secure_url)
      .filter(url => url !== undefined && url !== null);

    // Filter out deleted images from existing
    let updatedPhotoList = existingRoom.roomPhotos || [];
    if (parsedImagesToDelete.length > 0) {
      updatedPhotoList = updatedPhotoList.filter(photo => !parsedImagesToDelete.includes(photo));

      // Delete from Cloudinary
      for (const url of parsedImagesToDelete) {
        // await deleteFile(url);
        await deleteFile(url)
      } 
    }

    // Merge updated list with new uploads
    const finalPhotoList = [...updatedPhotoList, ...uploadedPhotoUrls];

    const slugified = slug(roomTitle);

    const updatedRoom = await Room.findByIdAndUpdate(
      roomId,
      {
        roomTitle,
        slug: slugified,
        roomStandard,
        roomDescription,
        roomFacilities: parsedFacilities,
        accommodation,
        roomPhotos: finalPhotoList,
      },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Room updated successfully", data: updatedRoom });
  } catch (error) {
    console.error("Error editing room:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export default editRoom;
