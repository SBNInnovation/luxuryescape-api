import { Request, Response } from "express";
import Accommodation from "../../models/accommodation.models/Accommodation";


export const getAllAccommodationsWithRooms = async (req:Request, res:Response) => {
  try {
    const accommodations = await Accommodation.aggregate([
      {
        $lookup: {
          from: "rooms", // Name of the Room collection
          localField: "_id", // Field in Accommodation schema
          foreignField: "accommodation", // Field in Room schema that references Accommodation
          as: "rooms", // The resulting field name in the response
        },
      },
      {
        $sort: { createdAt: -1 }, // Sort by newest accommodations first
      },
    ]);

    res.status(200).json(accommodations);
  } catch (error) {
    if(error instanceof(Error))
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default getAllAccommodationsWithRooms