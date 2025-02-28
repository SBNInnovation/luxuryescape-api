import { Request, Response } from "express";
import Trek from "../../models/trek.models/trek.js";


const getSelectedDataForTrek = async (req: Request, res: Response): Promise<void> => {
    try {
        const getAllSelectedDataForTrek = await Trek.find({}).select("idealTime thumbnail trekName trekOverview cost");

        if (!getAllSelectedDataForTrek || getAllSelectedDataForTrek.length === 0) {
            res.status(404).json({ success: false, message: "No data found" });
            return;
        }

        res.status(200).json({ success: true, data: getAllSelectedDataForTrek });
    } catch (error) {
        console.error("Error fetching selected data for trek:", error);
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Server error" });
    }
};

export default getSelectedDataForTrek;
