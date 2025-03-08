import { Request, Response } from "express";
import TourTypes from "../../models/tourTypes.models/tourTypes.js";
import Tour from "../../models/tours.models/tours.js";
import Trek from "../../models/trek.models/trek.js";
import Accommodation from "../../models/accommodation.models/Accommodation.js";
import Room from "../../models/rooms.models/room.js";
// import TourTypes from "../../models/tourTypes.models/tourTypes.js";



// const getTourByTourTypes = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { tourTypeSlug } = req.params;


//         if (!tourTypeSlug) {
//             res.status(400).json({ success: false, message: "Tour Type Slug is required" });
//             return
//         }

//         const tourType = await TourTypes.findOne({ slug: tourTypeSlug });

//         if (!tourType) {
//             res.status(404).json({ success: false, message: "Tour type not found" });
//             return
//         }

//         const tours = await Tour.find({ tourTypes: tourType._id });

//         if (tours.length === 0) {
//             res.status(404).json({ success: false, message: "No tours found for the specified type" });
//             return
//         }

//         res.status(200).json({ success: true, message: "Tours found", data: tours });
//     } catch (error) {
//         console.error("Error fetching tours by type slug:", error);
//         res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// };

// export default getTourByTourTypes;



// const globalSearch = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const page: number = parseInt(req.query.page as string) || 1; 
//         const limit: number = parseInt(req.query.limit as string) || 10;
//         const  q  = req.query.q?.toString();

//         if (!q) {
//             res.status(400).json({ success: false, message: "Search query is required" });
//             return;
//         }

//         if (page < 1 || limit < 1) {
//             res.status(400).json({ success: false, message: "Invalid pagination parameters" });
//             return;
//         }

//         const skip = (page - 1) * limit;

//         const searchRegex = { $regex: q, $options: "i" }; 

       
//         const matchingTourTypes = await TourTypes.find({ 
//             $or: [
//                 { tourType: searchRegex },
//                 { slug: searchRegex },
//                 { description: searchRegex }
//             ]
//         }); 

//         const tourTypeIds = matchingTourTypes.map(tt => tt._id);

        
//         const [tours, treks, accommodations] = await Promise.all([
//             Tour.find({ 
//                 $or: [
//                     { tourName: searchRegex },
//                     { slug: searchRegex },
//                     { location: searchRegex },
//                     { tourOverview: searchRegex },
//                     { tourTypes: { $in: tourTypeIds } }
//                 ]
//             }).select("_id tourName slug thumbnail cost type"),
            
//             Trek.find({ $or: [
//                 { trekName: searchRegex },
//                 { slug: searchRegex },
//                 { location: searchRegex },
//                 { trekOverview: searchRegex }
//             ]}).select("_id trekName slug thumbnail cost difficultyLevel type"),
            
//             Accommodation.find({ $or: [
//                 { accommodationTitle: searchRegex },
//                 { slug: searchRegex },
//                 { accommodationLocation: searchRegex },
//                 { accommodationDescription: searchRegex }
//             ]}).select("_id accommodationTitle slug accommodationLocation accommodationRating thumbnail"),
//         ])
        

//         const totalTours = await Tour.countDocuments(); 
//        // Combine all results and flatten into a single array
//         const results = [tours, treks, matchingTourTypes, accommodations]
//         .flat()
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit);
//         // .map(item => ({
//         //     ...item.toObject(), // Convert Mongoose document to plain object
//         //     // type: item.constructor.name. // Get model name (Tour, Trek, etc.)
//         // }));

//         res.status(200).json({ success: true, message: "Search results", data: results ,
//             pagination: {
//                 totalTours,
//                 currentPage: page,
//                 totalPages: Math.ceil(totalTours / limit),
//                 limit,
//             }
//         });
//     } catch (error) {
//         console.error("Error performing global search:", error);
//         res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// };

// export default globalSearch;


const globalSearch = async (req: Request, res: Response): Promise<void> => {
    try {
        // Parse query parameters
        const page: number = Math.max(1, parseInt(req.query.page as string, 10) || 1);
        const limit: number = Math.max(1, parseInt(req.query.limit as string, 10) || 10);
        const q: string | undefined = req.query.q?.toString();

        if (!q) {
            res.status(400).json({ success: false, message: "Search query is required" });
            return;
        }

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
                .select("_id tourName slug thumbnail cost type"),

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
                .select("_id trekName slug thumbnail cost difficultyLevel type"),

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
                .select("_id accommodationTitle slug accommodationLocation accommodationRating thumbnail"),

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
            ]).then(counts => counts.reduce((acc, count) => acc + count, 0)) // Summing total matching docs
        ]);

        // Combine all results
        const results = [...tours, ...treks, ...matchingTourTypes, ...accommodations];

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

