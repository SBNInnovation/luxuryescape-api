import { Request, Response } from "express";
import Tour from "../../models/tours.models/tours.js";

const getAllTours = async (req: Request, res: Response): Promise<void> => {
  try {
    const page: number = parseInt(req.query.page as string) || 1; 
    const limit: number = parseInt(req.query.limit as string) || 10;

    if (page < 1 || limit < 1) {
      res.status(404).json({ success: false, message: "Invalid pagination parameters" });
      return;
    }
    const skip = (page - 1) * limit;

    const allTours = await Tour.find({})
      .sort({ createdAt: -1 }) // Fetch tours with pagination and sorting by `createdAt` in desending
      .skip(skip)
      .limit(limit);

    if (allTours.length === 0) {
      res.status(404).json({ success: false, message: "No tours found" });
      return;
    }

    const totalTours = await Tour.countDocuments(); // Count total tours in the database

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
