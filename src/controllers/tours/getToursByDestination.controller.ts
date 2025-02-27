import { Request, Response } from "express";
import Tour from "../../models/tours.models/tours.js";

const getToursByDestination = async (req: Request, res: Response):Promise<void> => {
  try {
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;
    const search = req.query.search?.toString();
    const country = req.query.country?.toString();

    if (page < 1 || limit < 1) {
        res.status(400).json({ success: false, message: "Invalid pagination parameters" });
        return
    }

    const skip = (page - 1) * limit;

    const query: any = {};
    if (country) query.country = {$regex:country, $options: 'i'}
    if (search) query.tourName = { $regex: search, $options: "i" };

    const getTour = await Tour.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (getTour.length === 0) {
      res.status(404).json({ success: false, message: "No tours found" });
      return
    }

    const totalTours = await Tour.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Tours fetched successfully",
      data: {
        tours: getTour,
        pagination: {
          totalTours,
          currentPage: page,
          totalPages: Math.ceil(totalTours / limit),
          limit,
        },
      },
    });
  } catch (error) {
    if(error instanceof(Error))
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export default getToursByDestination;
