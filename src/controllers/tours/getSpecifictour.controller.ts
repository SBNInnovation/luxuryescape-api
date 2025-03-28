import { Request, Response } from "express";
import Tour from "../../models/tours.models/tours.js";
import { BookingPrice } from "../../models/bookingPrice.models/bookingPrice.js";

const getSpecificTour = async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.params;

        if (!slug) {
            res.status(400).json({ success: false, message: "Slug is required." });
            return;
        }

        const tour = await Tour.findOne({ slug });

        if (!tour) {
            res.status(404).json({ success: false, message: "No tour found." });
            return;
        }

        tour.viewsCount += 1;
        await tour.save();

        const [bookingDetails, specificTour] = await Promise.all([
            BookingPrice.findOne({ adventureType: "Tour", tourId: tour._id }),
            Tour.findOne({ slug }).populate({
                path: "tourItinerary.accommodation",
                select: "accommodationTitle slug accommodationPics",
            }),
        ]);

        res.status(200).json({
            success: true,
            message: "Specific tour data",
            data: { specificTour, bookingDetails },
        });
    } catch (error) {
        console.error("Error fetching tour:", error);
        if(error instanceof(Error)){
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

export default getSpecificTour;
