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



const globalSearch = async (req: Request, res: Response): Promise<void> => {
    try {
        const { q } = req.query;

        if (!q) {
            res.status(400).json({ success: false, message: "Search query is required" });
            return;
        }

        const searchRegex = { $regex: q, $options: "i" }; 

       
        const matchingTourTypes = await TourTypes.find({ 
            $or: [
                { tourType: searchRegex },
                { slug: searchRegex },
                { description: searchRegex }
            ]
        }).select("_id"); 

        const tourTypeIds = matchingTourTypes.map(tt => tt._id);

        
        const [tours, treks, accommodations, rooms] = await Promise.all([
            Tour.find({ 
                $or: [
                    { tourName: searchRegex },
                    { slug: searchRegex },
                    { location: searchRegex },
                    { tourOverview: searchRegex },
                    { tourTypes: { $in: tourTypeIds } }
                ]
            }).select("_id tourName slug thumbnail cost type"),
            
            Trek.find({ $or: [
                { trekName: searchRegex },
                { slug: searchRegex },
                { location: searchRegex },
                { trekOverview: searchRegex }
            ]}).select("_id trekName slug thumbnail cost difficultyLevel type"),
            
            Accommodation.find({ $or: [
                { accommodationTitle: searchRegex },
                { slug: searchRegex },
                { accommodationLocation: searchRegex },
                { accommodationDescription: searchRegex }
            ]}).select("_id accommodationTitle slug accommodationLocation accommodationRating thumbnail"),
            
            Room.find({ $or: [
                { roomTitle: searchRegex },
                { slug: searchRegex },
                { roomDescription: searchRegex },
                { roomStandard: searchRegex }
            ]}).select("_id roomTitle slug roomStandard roomFacilities roomPhotos"),
        ]);

       // Combine all results and flatten into a single array
        const results = [tours, treks, matchingTourTypes, accommodations, rooms]
        .flat()
        // .map(item => ({
        //     ...item.toObject(), // Convert Mongoose document to plain object
        //     // type: item.constructor.name. // Get model name (Tour, Trek, etc.)
        // }));

        res.status(200).json({ success: true, message: "Search results", data: results });
    } catch (error) {
        console.error("Error performing global search:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export default globalSearch;
