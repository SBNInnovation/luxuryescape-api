import { Request, Response } from "express";
import Trek from "../../models/trek.models/trek.js";
import { BookingPrice } from "../../models/bookingPrice.models/bookingPrice.js";

const getSpecificTrek = async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.params;

        if (!slug) {
            res.status(400).json({ success: false, message: "Slug is required." });
            return;
        }

        const trek = await Trek.findOne({ slug });

        if (!trek) {
            res.status(404).json({ success: false, message: "Trek not found." });
            return;
        }

        trek.viewsCount += 1;
        await trek.save();
       
        const [bookingDetails, specificTrek] = await Promise.all([
            BookingPrice.findOne({ adventureType: "Trekking", trekId: trek._id }),
            Trek.findOne({ slug }).populate({
                path: "trekItinerary.accommodation",
                select: "accommodationTitle slug accommodationPics accommodationRating",
            }),
        ]);

        res.status(200).json({
            success: true,
            message: "Specific trek data",
            data: {specificTrek,bookingDetails},
        });
    } catch (error) {
        console.error("Error fetching trek:", error);
        if(error instanceof(Error)){
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

export default getSpecificTrek;
