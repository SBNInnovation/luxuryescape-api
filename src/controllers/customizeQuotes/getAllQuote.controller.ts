import { Request, Response } from "express";
import CustomizeQuote from "../../models/customizeQuote.models/customizeQuote.js";


const getAllQuote = async (req: Request, res: Response):Promise<void> => {
    try {
        const quotes = await CustomizeQuote.find({})
        .populate("tourId", "slug") // Correct reference field
        // .populate("trekId", "slug") // Populate trek details if needed
        .sort({ createdAt: -1 }) 

        if (!quotes || quotes.length === 0) {
            res.status(404).json({ success: false, message: "No quotes found" });
            return 
        }

        res.status(200).json({ success: true, data: quotes });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export default getAllQuote;
