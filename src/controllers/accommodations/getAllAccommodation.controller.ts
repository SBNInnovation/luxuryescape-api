import { Request, Response } from "express";
import Accommodation from "../../models/accommodation.models/Accommodation.js";

const getAllAccommodation = async (req: Request, res: Response): Promise<void> => {
  try {
    // Parse pagination parameters
    const page: number = parseInt(req.query.page as string, 10) || 1;
    const limit: number = parseInt(req.query.limit as string, 10) || 10;
    const search = req.query.search as string || ""?.toLowerCase().trim();
    const location = req.query.locationFilter as string || ""?.toLowerCase().trim(); 
    const sort = (req.query.sort as string || "").toLowerCase().trim();

    // Validate pagination values
    if (page < 1 || limit < 1) {
      res.status(400).json({ success: false, message: "Invalid page or limit value." });
      return;
    }

    // Calculate documents to skip
    const skip = (page - 1) * limit;

    // Build query based on the search keyword and location
    const query: any = {};

    if (search) {
      query.$or = [
        { accommodationTitle: { $regex: search, $options: "i" } },
        { accommodationLocation: { $regex: search, $options: "i" } },
      ];
    }

    if (location) {
      query.accommodationLocation = { $regex: location, $options: "i"}
    }

      // Sorting logic (default: newest first)
      let sortQuery: any = { createdAt: -1 };
      if (sort === "asc") {
        sortQuery = { createdAt: 1 };
      } else if (sort === "desc") {
        sortQuery = { createdAt: -1 };
      }
        

    // Fetch accommodations with pagination and sorting
    const accommodations = await Accommodation.find(query)
      .skip(skip)
      .limit(limit)
      .sort(sortQuery)
    
    // Fetch total count of matching documents (for pagination metadata)
    const total = await Accommodation.countDocuments(query);

    // Check if accommodations exist
    if (!accommodations.length) {
      res.status(404).json({ success: false, message: "No accommodations found." });
      return;
    }

    // Respond with accommodations and pagination metadata
    res.status(200).json({
      success: true,
      message: "Accommodations fetched successfully.",
      data: {
        accommodations,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching accommodations:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export default getAllAccommodation;
