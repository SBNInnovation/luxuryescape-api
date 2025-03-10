import { Request, Response } from "express";
import Trek from "../../models/trek.models/trek.js";


const getSelectedTrekData = async (req: Request, res: Response): Promise<void> => {
  try {
    const page: number = Math.max(parseInt(req.query.page as string) || 1, 1); 
    const limit: number = Math.max(parseInt(req.query.limit as string) || 10, 1); 
    const country = req.query.country?.toString();
    const activation = req.query.activation?.toString();
    const sort = req.query.sort?.toString();
    const search = req.query.search?.toString();

    const skip = (page - 1) * limit;

    let query: any = {};
    if (search) {
      query.$or = [
        { trekName: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } }
      ];
    }
    if (country) {
      query.country = country;
    }

    if (activation === "active") {
      query.isActivate = true;
    } else if (activation === "inactive") {
      query.isActivate = false; 
    }
    
    let sortQuery: any = {};
    if (sort === "createdAtasc") {
      sortQuery.createdAt = 1;
    } else if (sort === "createdAtdesc") {
      sortQuery.createdAt = -1;
    } else if (sort === "asc") {
      sortQuery.cost = 1;
    } else if (sort === "desc") {
      sortQuery.cost = -1;
    } else {
      sortQuery.createdAt = -1;
    }

    // Fetch trek data based on the query
    const getAllSelectedTrekData = await Trek.find(query)
      .select("idealTime thumbnail trekName trekOverview cost createdAt isActivate country location")
      .sort(sortQuery)
      .limit(limit)
      .skip(skip);

    if (!getAllSelectedTrekData.length) {
      res.status(404).json({ success: false, message: "No data found" });
      return;
    }

    const totalTrek = await Trek.countDocuments(query);

    res.status(200).json({
      success: true, 
      data: {
        treks: getAllSelectedTrekData,
        pagination: {
          totalTrek,
          currentPage: page,
          totalPages: Math.ceil(totalTrek / limit),
          limit,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching selected trek data:", error);
    res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Server error" });
  }
};

export default getSelectedTrekData;
