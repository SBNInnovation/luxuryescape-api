import { Request, Response } from "express";
import TourTypes from "../../models/tourTypes.models/tourTypes.js";
import Tour from "../../models/tours.models/tours.js";


const getTourByTourTypes = async (req: Request, res: Response): Promise<void> => {
    try {
        const { tourTypeSlug } = req.params;


        if (!tourTypeSlug) {
            res.status(400).json({ success: false, message: "Tour Type Slug is required" });
            return
        }

        const tourType = await TourTypes.findOne({ slug: tourTypeSlug });

        if (!tourType) {
            res.status(404).json({ success: false, message: "Tour type not found" });
            return
        }

        const tours = await Tour.find({ tourTypes: tourType._id });

        if (tours.length === 0) {
            res.status(404).json({ success: false, message: "No tours found for the specified type" });
            return
        }

        res.status(200).json({ success: true, message: "Tours found", data: tours });
    } catch (error) {
        console.error("Error fetching tours by type slug:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export default getTourByTourTypes;
