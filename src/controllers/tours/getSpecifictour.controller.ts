import { Request, Response } from "express";
import Tour from "../../models/tours.models/tours.js";

const getSpecificTour = async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.params;

        if (!slug) {
            res.status(400).json({ success: false, message: "Slug is required." });
            return;
        }

        // Corrected .populate() syntax
        const specificTour = await Tour.findOne({ slug })
            .populate({
                path: "tourItinerary.accommodation",
                select: "accommodationTitle slug accommodationPics",
            });

        if (!specificTour) {
            res.status(404).json({ success: false, message: "Tour not found." });
            return;
        }

        res.status(200).json({ success: true, message: "Specific tour data", data: specificTour });
    } catch (error) {
        console.error("Error fetching tour:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export default getSpecificTour;
