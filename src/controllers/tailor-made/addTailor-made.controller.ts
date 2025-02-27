import { Request, Response } from "express";
import TailorMade from "../../models/tailor-made.models/tailor-made.js";

const addTailormade = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            country,
            dreamDestination,
            fixedDates,
            flexibleDates,
            travelDuration,
            travelers,
            experienceLevel,
            hotelStandard,
            hotelBrandPreference,
            transportationPreferences,
            mealPreferences,
            budget,
            dreamExperience
        } = req.body;

        if (!firstName || !lastName || !email || !phone || !country || !dreamDestination || 
            (!fixedDates && !flexibleDates) || !travelDuration || 
            !travelers || !experienceLevel || !hotelStandard || !mealPreferences || !budget || !dreamExperience) {
            res.status(400).json({ success: false, message: "All required fields must be provided" });
            return;
        }

        const parsedDreamDestination = dreamDestination? JSON.parse(dreamDestination) : [];
        const parsedTransportationPreferences = transportationPreferences? JSON.parse(transportationPreferences) : []

        if (!Array.isArray(parsedDreamDestination) || !Array.isArray(parsedTransportationPreferences)) {
            res.status(400).json({ success: false, message: "dreamDestination and transportationPreferences must be arrays" });
            return;
        }

        const tailorMadeRequest = new TailorMade({
            firstName,
            lastName,
            email,
            phone,
            country,
            dreamDestination : parsedDreamDestination,
            fixedDates,
            flexibleDates,
            travelDuration,
            travelers,
            experienceLevel,
            hotelStandard,
            hotelBrandPreference,
            transportationPreferences : parsedTransportationPreferences,
            mealPreferences,
            budget,
            dreamExperience
        });

        await tailorMadeRequest.save();

        res.status(201).json({ success: true, message: "Tailor-made request created successfully", data: tailorMadeRequest });

    } catch (error) {
        console.error("Error creating tailor-made request:", error);
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
    }
};

export default addTailormade;
