// import { Request, Response } from "express";
// import CustomizeQuote from "../../models/customizeQuote.models/customizeQuote.js";

// const getAllQuote = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const search = req.query.search?.toString();
//         let query: any = {};

//         if (search) {
//             query.$or = [
//                 { name: { $regex: search, $options: 'i' } },
//                 { email: { $regex: search, $options: 'i' } },
//                 { number: { $regex: search, $options: 'i' } },
//                 { tourName: { $regex: search, $options: 'i' } },
//                 { trekName: { $regex: search, $options: 'i' } },
//             ];
//         }

//         const quotes = await CustomizeQuote.find(query).sort({
//             status:"pending"? -1 : 1, // Custom sorting
//             createdAt: -1, // Optional: Sort by latest created date
//         });

//         if (!quotes || quotes.length === 0) {
//             res.status(404).json({ success: false, message: "No quotes found" });
//             return;
//         }

//         res.status(200).json({ success: true, data: quotes });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// };

// export default getAllQuote;




import { Request, Response } from "express";
import CustomizeQuote from "../../models/customizeQuote.models/customizeQuote.js";

const getAllQuote = async (req: Request, res: Response): Promise<void> => {
    try {
        const search = req.query.search?.toString();
        let query: any = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { number: { $regex: search, $options: 'i' } },
                { tourName: { $regex: search, $options: 'i' } },
                { trekName: { $regex: search, $options: 'i' } },
            ];
        }

        const quotes = await CustomizeQuote.aggregate([
            { $match: query },
            {
                $addFields: {
                    statusOrder: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$status", "pending"] }, then: 0 }, // "pending" first
                                { case: { $eq: ["$status", "viewed"] }, then: 1 }, // "approved" next
                                { case: { $eq: ["$status", "mailed"] }, then: 2 }, // "rejected" last
                            ],
                            default: 3,
                        },
                    },
                },
            },
            { $sort: { statusOrder: 1, createdAt: -1 } }, // Sort by custom order, then by recent entries
            { $project: { statusOrder: 0 } }, // Remove computed field from final output
        ]);

        if (!quotes || quotes.length === 0) {
            res.status(404).json({ success: false, message: "No quotes found" });
            return;
        }

        res.status(200).json({ success: true, data: quotes });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export default getAllQuote;
