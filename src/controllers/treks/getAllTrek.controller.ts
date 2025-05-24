import { Request, Response } from "express";
import Trek from "../../models/trek.models/trek.js";




const getAllTreks = async (req: Request, res: Response): Promise<void> => {
  try {
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;
    const search = req.query.search?.toString();
    const activation = req.query.activation?.toString();

    if (page < 1 || limit < 1) {
      res.status(400).json({ success: false, message: "Invalid pagination parameters" });
      return;
    }

    const skip = (page - 1) * limit;

    let query: any = {};
    if (search) {
      query.$or = [
        { trekName: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } }
      ];
    }

    if (activation === "active") {
      query.isActivate = true;
    } else if (activation === "inactive") {
      query.isActivate = false; 
    }
    

    const allTreks = await Trek.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (allTreks.length === 0) {
      res.status(404).json({ success: false, message: "No treks found", data:{} });
      return;
    }

    const totalTreks = await Trek.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Treks fetched successfully",
      data: {
        treks: allTreks,
        pagination: {
          totalTreks,
          currentPage: page,
          totalPages: Math.ceil(totalTreks / limit),
          limit,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching treks:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default getAllTreks;
