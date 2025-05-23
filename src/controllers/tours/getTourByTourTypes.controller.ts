import { Request, Response } from "express";
import TourTypes from "../../models/tourTypes.models/tourTypes.js";
import Tour from "../../models/tours.models/tours.js";
import Trek from "../../models/trek.models/trek.js";
import Accommodation from "../../models/accommodation.models/Accommodation.js";

const globalSearch = async (req: Request, res: Response): Promise<void> => {
    try {
        // Parse query parameters
        const page: number = Math.max(1, parseInt(req.query.page as string, 10) || 1);
        const limit: number = Math.max(1, parseInt(req.query.limit as string, 10) || 10);
        const q: string | undefined = req.query.q? req.query.q.toString() : "";

        // Define regex search
        const searchRegex = { $regex: q, $options: "i" };

        // Find matching TourTypes (needed for linking tours)
        const matchingTourTypes = await TourTypes.find({
            $or: [
                { tourType: searchRegex },
                { slug: searchRegex },
                { description: searchRegex }
            ]
        });

        const tourTypeIds = matchingTourTypes.map(tt => tt._id);

        // Fetch results with sorting and pagination applied at the database level
        const [tours, treks, accommodations, totalResults] = await Promise.all([
            Tour.find({
                $or: [
                    { tourName: searchRegex },
                    { slug: searchRegex },
                    { location: searchRegex },
                    { tourOverview: searchRegex },
                    { tourTypes: { $in: tourTypeIds } }
                ]
            })
                .sort({ createdAt: -1 }) // Sorting at the DB level
                .skip((page - 1) * limit)
                .limit(limit)
                .select("_id tourName slug thumbnail cost type country"),

            Trek.find({
                $or: [
                    { trekName: searchRegex },
                    { slug: searchRegex },
                    { location: searchRegex },
                    { trekOverview: searchRegex }
                ]
            })
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .select("_id trekName slug thumbnail cost difficultyLevel type country"),

            Accommodation.find({
                $or: [
                    { accommodationTitle: searchRegex },
                    { slug: searchRegex },
                    { accommodationLocation: searchRegex },
                    { accommodationDescription: searchRegex }
                ]
            })
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .select("_id accommodationTitle slug accommodationLocation accommodationRating thumbnail type country accommodationPics"),

            // Get total count of all matching results (without pagination)
            Promise.all([
                Tour.countDocuments({ $or: [
                    { tourName: searchRegex },
                    { slug: searchRegex },
                    { location: searchRegex },
                    { tourOverview: searchRegex },
                    { tourTypes: { $in: tourTypeIds } }
                ]}),

                Trek.countDocuments({ $or: [
                    { trekName: searchRegex },
                    { slug: searchRegex },
                    { location: searchRegex },
                    { trekOverview: searchRegex }
                ]}),

                Accommodation.countDocuments({ $or: [
                    { accommodationTitle: searchRegex },
                    { slug: searchRegex },
                    { accommodationLocation: searchRegex },
                    { accommodationDescription: searchRegex }
                ]})
            ]).then(counts => counts.reduce((acc, count) => acc + count, 0)) 
        ]);

        // Combine all results
        const results = [...tours, ...treks, ...accommodations];

        // Send response with pagination
        res.status(200).json({
            success: true,
            message: "Search results",
            data: results,
            pagination: {
                totalResults,
                currentPage: page,
                totalPages: Math.ceil(totalResults / limit),
                limit,
            }
        });

    } catch (error) {
        console.error("Error performing global search:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export default globalSearch;

