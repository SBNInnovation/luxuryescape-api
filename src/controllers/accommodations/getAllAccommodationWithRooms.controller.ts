import { Request, Response } from "express";
import Accommodation from "../../models/accommodation.models/Accommodation.js";

export const getAllAccommodationsWithRooms = async (req: Request, res: Response):Promise<void> => {
  try {
    // Parse query parameters for page, limit, and location filter
    const page: number = parseInt(req.query.page as string, 10) || 1;
    const limit: number = parseInt(req.query.limit as string, 10) || 10;
    const location = req.query.locationFilter as string || "";

    // Validate pagination values
    if (page < 1 || limit < 1) {
        res.status(400).json({ success: false, message: "Invalid page or limit value." });
        return
    }

    // Calculate documents to skip for pagination
    const skip = (page - 1) * limit;

    // Build the aggregation pipeline
    const pipeline: any[] = [
      // Match location filter if provided
      ...(location
        ? [
            {
              $match: {
                accommodationLocation: { $regex: location, $options: "i" }, // Case-insensitive match
              },
            },
          ]
        : []),
      // Look up related rooms
      {
        $lookup: {
          from: "rooms", // Name of the Room collection
          localField: "_id", // Field in Accommodation schema
          foreignField: "accommodation", // Field in Room schema that references Accommodation
          as: "rooms", // The resulting field name in the response
        },
      },
      // Sort by the newest accommodation first
      {
        $sort: { createdAt: -1 },
      },
      // Pagination: Skip and Limit
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ];

    // Execute the aggregation query
    const accommodations = await Accommodation.aggregate(pipeline);

    //  the result
    res.status(200).json({success:true, data:accommodations});
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
};

export default getAllAccommodationsWithRooms;
