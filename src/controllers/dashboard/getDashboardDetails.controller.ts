import { Request, Response } from "express";
import Tour from "../../models/tours.models/tours.js";
import Trek from "../../models/trek.models/trek.js";
import Accommodation from "../../models/accommodation.models/Accommodation.js";
import Blog from "../../models/blogs.models/blogs.js";
import TailorMade from "../../models/tailor-made.models/tailor-made.js";
import CustomizeQuote from "../../models/customizeQuote.models/customizeQuote.js";

const getDetailsForDashboard = async (req: Request, res: Response):Promise<void> => {
    try {
        // Run database queries concurrently
        const [
            getTourDetails,
            getTrekDetails,
            getAccommodationDetails,
            getBlogDetails,
            getRecentTailormade,
            getRecentInquiry
        ] = await Promise.all([
            Tour.countDocuments({ isActivate: true }),
            Trek.countDocuments({ isActivate: true }),
            Accommodation.countDocuments(),
            Blog.countDocuments(),
            TailorMade.find({})
                .sort({ createdAt: -1 })
                .limit(3)
                .select("firstname lastname email country experienceLevel budget status createdAt"),
            CustomizeQuote.find({})
                .sort({ createdAt: -1 })
                .limit(5)
                .select("name email tourName trekName tourId trekId status createdAt type")
        ]);

        res.status(200).json({
            success: true,
            data: {
                tourCount: getTourDetails,
                trekCount: getTrekDetails,
                accommodationCount: getAccommodationDetails,
                blogCount: getBlogDetails,
                recentTailormade: getRecentTailormade,
                recentInquiries: getRecentInquiry
            }
        });

    } catch (error) {
        if(error instanceof(Error))
        res.status(500).json({ success: false, message: error.message });
        return
    }
};

export default getDetailsForDashboard;
