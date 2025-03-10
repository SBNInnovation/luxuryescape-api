import { Request, Response } from "express";
import Tour from "../../models/tours.models/tours.js";

const getSelectedData = async (req: Request, res: Response): Promise<void> => {
    try {
        const page: number = Math.max(parseInt(req.query.page as string) || 1, 1); 
        const limit: number = Math.max(parseInt(req.query.limit as string) || 10, 1); 
        const country = req.query.country?.toString();
        const sort = req.query.sort?.toString();
        const search = req.query.search?.toString();

        const skip = (page - 1) * limit;

        let query: any = {};
        if (search) {
            query.$or = [
                { tourName: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } }
            ];
        }
        if (country) {
            query.country = country;
        }
        
        let sortQuery: any = {};
        if (sort === "createdAtasc"){
            sortQuery.createdAt = 1
        }else if(sort === "createdAtdesc"){
            sortQuery.createdAt = -1
        }else if(sort === "asc"){
            sortQuery.price = 1
        }else if(sort === "desc"){
            sortQuery.price = -1
        }else{
            sortQuery.createdAt = -1
        }

        // Fetch data with sorting, pagination, and selected fields
        const getAllSelectedData = await Tour.find(query)
            .select("idealTime thumbnail tourName tourOverview cost createdAt isActivate country location")
            .sort(sortQuery)
            .limit(limit)
            .skip(skip);

        if (!getAllSelectedData.length) {
            res.status(404).json({ success: false, message: "No data found" });
            return;
        }

        const totalTours = await Tour.countDocuments(query)

        res.status(200).json({ success: true, data: {
            tours: getAllSelectedData,
            pagination: {
                totalTours,
                currentPage: page,
                totalPages: Math.ceil(totalTours / limit),
                limit,
              } 
        }});
    } catch (error) {
        console.error("Error fetching selected data:", error);
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Server error" });
    }
};

export default getSelectedData;
