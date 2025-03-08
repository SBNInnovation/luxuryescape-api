import { Request, Response } from "express";
import Accommodation from "../../models/accommodation.models/Accommodation.js";

export const getAllAccommodationsWithRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    // Parse query parameters for page, limit, and location filter
    const page: number = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit: number = Math.max(1, parseInt(req.query.limit as string, 10) || 10);
    const location: string = (req.query.locationFilter as string) || "";

    // Calculate documents to skip for pagination
    const skip = (page - 1) * limit;

    // Build the aggregation pipeline
    const pipeline: any[] = [
      ...(location
        ? [{ $match: { country: { $regex: location, $options: "i" } } }]
        : []
      ),
      {
        $lookup: {
          from: "rooms",
          localField: "_id",
          foreignField: "accommodation",
          as: "rooms",
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    // Execute the aggregation query
    const accommodations = await Accommodation.aggregate(pipeline);

    // Fetch total count of matching accommodations
    const total = await Accommodation.countDocuments(
      location ? { accommodationLocation: { $regex: location, $options: "i" } } : {}
    );

    // Send response
    res.status(200).json({
      success: true,
      data: {
        accommodations,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export default getAllAccommodationsWithRooms;
