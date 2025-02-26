import { Request, Response } from "express";
import Tour from "../../models/tours.models/tours.js";

const getSelectedData = async (req: Request, res: Response): Promise<void> => {
    try {
        const getAllSelectedData = await Tour.find({}).select("idealTime thumbnail tourName tourOverview cost");

        if (!getAllSelectedData || getAllSelectedData.length === 0) {
            res.status(404).json({ success: false, message: "No data found" });
            return;
        }

        res.status(200).json({ success: true, data: getAllSelectedData });
    } catch (error) {
        console.error("Error fetching selected data:", error);
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Server error" });
    }
};

export default getSelectedData;
