import { Request, Response } from "express";
import CustomizeQuote from "../../models/customizeQuote.models/customizeQuote.js";
import TailorMade from "../../models/tailor-made.models/tailor-made.js";
import Agent from "../../models/agent.models/Agent.js";

const getAllUserData = async (req: Request, res: Response): Promise<void> => {
    const page: number = Math.max(parseInt(req.query.page as string) || 1, 1); 
    const limit: number = Math.max(parseInt(req.query.limit as string) || 10, 1); 
    const search = req.query.search?.toString();
    const country = req.query.country?.toString();
    const skip = (page - 1) * limit;

    try {
        const query: any = {}; 

        if (country) {
            query.country = country;
        }

        if (search) {
            query.$or = [
                { country: { $regex: search, $options: 'i' } },
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { number: { $regex: search, $options: 'i' } },
            ];
        }

        // Fetch total counts separately
        const [totalQuoteUsers, totalTailormadeUsers, totalAgentUsers] = await Promise.all([
            CustomizeQuote.countDocuments(query),
            TailorMade.countDocuments(query),
            Agent.countDocuments(query)
        ]);

        const total = totalQuoteUsers + totalTailormadeUsers + totalAgentUsers;

        const [getQuoteUser, getTailormadeUser, getAgentdata] = await Promise.all([
            CustomizeQuote.find(query).sort({ createdAt: -1 }).select("name email number createdAt").limit(limit).skip(skip),
            TailorMade.find(query).sort({ createdAt: -1 }).select("firstName lastName email phone country createdAt").limit(limit).skip(skip),
            Agent.find(query).sort({ createdAt: -1 }).limit(limit).skip(skip)
        ]);

        // Convert TailorMade data to match structure of other collections
        const tailorMadeFormatted = getTailormadeUser.map(user => ({
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            number: user.phone,
            country: user.country
        }));

        // Merge all data into a single array
        const mergedData = [...getQuoteUser, ...tailorMadeFormatted, ...getAgentdata];

        res.status(200).json({
            success: true,
            data: mergedData,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            }
        });
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Server error" });
    }
};

export default getAllUserData;
