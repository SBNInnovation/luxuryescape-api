import { Request, Response } from "express";
import nodemailer from "nodemailer";
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

        const parsedDreamDestination = dreamDestination ? JSON.parse(dreamDestination) : [];
        const parsedTransportationPreferences = transportationPreferences ? JSON.parse(transportationPreferences) : [];

        if (!Array.isArray(parsedDreamDestination) || !Array.isArray(parsedTransportationPreferences)) {
            res.status(400).json({ success: false, message: "dreamDestination and transportationPreferences must be arrays" });
            return;
        }

        // Create a new tailor-made travel document
        const tailorMadeRequest = new TailorMade({
            firstName,
            lastName,
            email,
            phone,
            country,
            dreamDestination: parsedDreamDestination,
            // dreamDestination,
            fixedDates,
            flexibleDates,
            travelDuration,
            travelers,
            experienceLevel,
            hotelStandard,
            hotelBrandPreference,
            transportationPreferences: parsedTransportationPreferences,
            // transportationPreferences,
            mealPreferences,
            budget,
            dreamExperience
        });

        await tailorMadeRequest.save();

        // Send email notification to Admin
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL as string, // Admin email
                pass: process.env.PASSWORD as string
            }
        });

        const mailOptions = {
            from: `Nepal Luxury Escapes <${process.env.EMAIL}>`,
            to: process.env.EMAIL, // Send email to Admin
            subject: "New Tailor-Made Travel Request Received",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background-color: #ffffff; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); border-left: 6px solid #E8B86D;">
                    <h2 style="color: #333; text-align: center; border-bottom: 2px solid #E8B86D; padding-bottom: 10px;">New Tailor-Made Request</h2>
                    <p style="font-size: 16px; color: #444; line-height: 1.6;"><strong>Client Name:</strong> ${firstName} ${lastName}</p>
                    <p style="font-size: 16px; color: #444; line-height: 1.6;"><strong>Email:</strong> ${email}</p>
                    <p style="font-size: 16px; color: #444; line-height: 1.6;"><strong>Phone:</strong> ${phone}</p>
                    <p style="font-size: 16px; color: #444; line-height: 1.6;"><strong>Country:</strong> ${country}</p>
                    <p style="font-size: 16px; color: #444; line-height: 1.6;"><strong>Dream Destination:</strong> ${parsedDreamDestination.join(", ")}</p>
                    <p style="font-size: 16px; color: #444; line-height: 1.6;"><strong>Travel Duration:</strong> ${travelDuration} days</p>
                    <p style="font-size: 16px; color: #444; line-height: 1.6;"><strong>Travelers:</strong> Adults: ${travelers.adults}, Children: ${travelers.children}</p>
                    <p style="font-size: 16px; color: #444; line-height: 1.6;"><strong>Experience Level:</strong> ${experienceLevel}</p>
                    <p style="font-size: 16px; color: #444; line-height: 1.6;"><strong>Hotel Standard:</strong> ${hotelStandard}</p>
                    <p style="font-size: 16px; color: #444; line-height: 1.6;"><strong>Hotel Brand Preference:</strong> ${hotelBrandPreference || "Not specified"}</p>
                    <p style="font-size: 16px; color: #444; line-height: 1.6;"><strong>Transportation Preferences:</strong> ${parsedTransportationPreferences.join(", ")}</p>
                    <p style="font-size: 16px; color: #444; line-height: 1.6;"><strong>Meal Preferences:</strong> ${mealPreferences}</p>
                    <p style="font-size: 16px; color: #444; line-height: 1.6;"><strong>Budget:</strong> ${budget}</p>
                    <p style="font-size: 16px; color: #444; line-height: 1.6;"><strong>Dream Experience:</strong> ${dreamExperience}</p>
                    ${flexibleDates ? `<p style="font-size: 16px; color: #444; line-height: 1.6;"><strong>Flexible Dates:</strong> ${flexibleDates}</p>` : ""}
                    ${fixedDates ? `<p style="font-size: 16px; color: #444; line-height: 1.6;"><strong>Fixed Dates:</strong> ${fixedDates}</p>` : ""}
                    <p style="font-size: 16px; color: #777; margin-top: 10px;">
                        <i>Please respond to the client as soon as possible.</i>
                    </p>
                </div>
            `
        };
        
        await transporter.sendMail(mailOptions);

        res.status(201).json({ success: true, message: "Tailor-made request created and email sent to admin.", data: tailorMadeRequest });

    } catch (error) {
        console.error("Error creating tailor-made request:", error);
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
    }
};

export default addTailormade;
