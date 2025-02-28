import { Request, Response } from "express";
import Trek from "../../models/trek.models/trek.js";

const getSpecificTrek = async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.params;

        if (!slug) {
            res.status(400).json({ success: false, message: "Slug is required." });
            return;
        }
        
        const specificTrek = await Trek.findOne({ slug })
            .populate({
                path: "trekItinerary.accommodation",
                select: "accommodationTitle slug accommodationPics",
            });

        if (!specificTrek) {
            res.status(404).json({ success: false, message: "Trek not found." });
            return;
        }

        res.status(200).json({ success: true, message: "Specific trek data", data: specificTrek });
    } catch (error) {
        console.error("Error fetching trek:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export default getSpecificTrek;
