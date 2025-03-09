import { Request, Response } from "express";
import Accommodation from "../../models/accommodation.models/Accommodation.js";

const getSelectedAccommodationData = async (req: Request, res: Response): Promise<void> => {
    try {
         // Parse pagination parameters
        const page: number = parseInt(req.query.page as string, 10) || 1;
        const limit: number = parseInt(req.query.limit as string, 10) || 10;
        const search = req.query.search as string || ""?.toLowerCase().trim();
        const location = req.query.locationFilter as string || ""?.toLowerCase().trim(); 
        const sort = (req.query.sort as string || "").toLowerCase().trim();
        const rating = req.query.rating?.toString().trim();
        
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
            query.country = { $regex: location, $options: "i"}
        }

        const intRating = Number(rating); 

        if (!isNaN(intRating)) {  
            query.accommodationRating = intRating; 
        }
        if(intRating){
            query.accommodationRating = intRating;
        }

            // Sorting logic (default: newest first)
        let sortQuery: any = { createdAt: -1 };
        if (sort === "asc") {
            sortQuery = { createdAt: 1 };
        } else if (sort === "desc") {
            sortQuery = { createdAt: -1 };
        }

        const getAllSelectedData = await Accommodation.find(query)
            .select("accommodationLocation accommodationTitle accommodationDescription accommodationRating accommodationPics country").sort(sortQuery).limit(limit).skip(skip)
            .lean(); // Improves performance by returning plain JavaScript objects

        if (!getAllSelectedData || getAllSelectedData.length === 0) {
            res.status(404).json({ success: false, message: "No data found" });
            return;
        }

        const formattedData = getAllSelectedData.map(item => ({
            ...item,
            accommodationPics: item.accommodationPics?.length ? [item.accommodationPics[0]] : [] // Returns only the first image
        }));

         // Fetch total count of matching documents (for pagination metadata)
            const total = await Accommodation.countDocuments(query);

        res.status(200).json({ success: true,   data: {
        formattedData,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        }
    }});
    } catch (error) {
        console.error("Error fetching selected accommodation data:", error);
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Server error" });
    }
};

export default getSelectedAccommodationData;
