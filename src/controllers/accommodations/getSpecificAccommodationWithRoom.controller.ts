import { Request, Response } from "express";
import Accommodation from "../../models/accommodation.models/Accommodation.js";

const getSpecificAccommodationWithRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    // Find the accommodation by slug and populate related rooms
    const accommodation = await Accommodation.aggregate([
      {
        $match: { slug: slug }, // Match accommodation by slug
      },
      {
        $lookup: {
          from: "rooms", // Collection name for rooms
          localField: "_id",
          foreignField: "accommodation",
          as: "rooms",
        },
      },
    ]);

    // If no accommodation is found
    if (!accommodation || accommodation.length === 0) {
      res.status(404).json({ success: false, message: "Accommodation not found" });
      return;
    }

    res.status(200).json({ success: true, data: accommodation[0] });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }
};

export default getSpecificAccommodationWithRoom;
