import { Request, Response } from "express";
import Accommodation from "../../models/accommodation.models/Accommodation.js";

const getSelectedAccommodationData = async (req: Request, res: Response): Promise<void> => {
    try {
        const getAllSelectedData = await Accommodation.find({})
            .select("accommodationLocation accommodationTitle accommodationDescription accommodationRating accommodationPics")
            .lean(); // Improves performance by returning plain JavaScript objects

        if (!getAllSelectedData || getAllSelectedData.length === 0) {
            res.status(404).json({ success: false, message: "No data found" });
            return;
        }

        const formattedData = getAllSelectedData.map(item => ({
            ...item,
            accommodationPics: item.accommodationPics?.length ? [item.accommodationPics[0]] : [] // Returns only the first image
        }));

        res.status(200).json({ success: true, data: formattedData });
    } catch (error) {
        console.error("Error fetching selected accommodation data:", error);
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Server error" });
    }
};

export default getSelectedAccommodationData;
