import { Request, Response } from "express";
import { uploadFile } from "../../utility/cloudinary.js";
import slug from "slug";
import Room from "../../models/rooms.models/room.js";

export interface MulterRequest extends Request {
  files?: {
    roomPhotos?: Express.Multer.File[];
  };
}

const editRoom = async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    const { roomId } = req.params; // Get roomId from request params
    const {
      roomTitle,
      roomStandard,
      roomDescription,
      roomFacilities,
      accommodation,
    } = req.body;

    // Validate required fields
    if (!roomTitle || !roomStandard || !roomDescription || !roomFacilities || !accommodation) {
      res.status(400).json({ success: false, message: "Please fill in all fields" });
      return;
    }

    // Parse facilities JSON string if needed
    const parsedFacilities = typeof roomFacilities === "string" ? JSON.parse(roomFacilities) : roomFacilities || [];

    // Handle file uploads using Multer
    const roomPhotos = req?.files?.roomPhotos || [];

    // Upload new room photos to Cloudinary
    const uploadedRoomPhotos = roomPhotos.length
      ? await Promise.all(
          roomPhotos.map(async (file) => {
            try {
              const uploaded = await uploadFile(file?.path || "", "tours/accommodation/rooms/images");
              return uploaded?.secure_url || null;
            } catch (error) {
              console.error("Error uploading room photo:", error);
              return null;
            }
          })
        )
      : [];

    // Remove null values if any upload failed
    const filteredRoomPhotos = uploadedRoomPhotos.filter((url) => url !== null);

    // Generate slug from title
    const slug1 = slug(roomTitle);

    // Find the room by ID and update it
    const updatedRoom = await Room.findByIdAndUpdate(
      roomId,
      {
        roomTitle,
        slug: slug1,
        roomStandard,
        roomDescription,
        roomFacilities: parsedFacilities,
        accommodation,
        ...(filteredRoomPhotos.length > 0 && { roomPhotos: filteredRoomPhotos }), // Only update photos if new ones are provided
      },
      { new: true }
    );

    if (!updatedRoom) {
      res.status(404).json({ success: false, message: "Room not found" });
      return;
    }

    res.status(200).json({ success: true, message: "Room updated successfully", data: updatedRoom });
  } catch (error) {
    console.error("Error editing room:", error);
    if (error instanceof Error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

export default editRoom;
