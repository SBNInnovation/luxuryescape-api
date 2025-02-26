import { Request, Response } from "express";
import CustomizeQuote from "../../models/customizeQuote.models/customizeQuote.js";

const deleteAllQuote = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await CustomizeQuote.deleteMany({});
        
        // Checking if any document was deleted
        if (result.deletedCount === 0) {
            res.status(404).json({ success: false, message: "No quotes found to delete" });
            return;
        }

        res.status(200).json({ success: true, message: "All quotes deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export default deleteAllQuote;
