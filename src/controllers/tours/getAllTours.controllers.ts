import { Request, Response } from "express";
import Tour from "../../models/tours.models/tours.js";

const getAllTours = async (req: Request, res: Response): Promise<void> => {
  try {
    const page: number = parseInt(req.query.page as string) || 1; 
    const limit: number = parseInt(req.query.limit as string) || 10;
    const search = req.query.search?.toString();

    if (page < 1 || limit < 1) {
      res.status(400).json({ success: false, message: "Invalid pagination parameters" });
      return;
    }

    const skip = (page - 1) * limit;

    // Fix: Use correct query structure
    const query = search
      ? { tourName: { $regex: search, $options: "i" } }
      : {};

    const allTours = await Tour.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (allTours.length === 0) {
      res.status(404).json({ success: false, message: "No tours found" });
      return;
    }

    const totalTours = await Tour.countDocuments(query); // Count only filtered tours

    res.status(200).json({
      success: true,
      message: "Tours fetched successfully",
      data: {
        tours: allTours,
        pagination: {
          totalTours,
          currentPage: page,
          totalPages: Math.ceil(totalTours / limit),
          limit,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching tours:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default getAllTours;
