import { Request, Response } from "express";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import CustomizeQuote from "../../models/customizeQuote.models/customizeQuote.js";

const addCustomizeQuote = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, number, message, tourName, tourId, trekName, trekId ,type} = req.body;

        if (!name || !email || !number || !message || (!tourName && !trekName)) {
            res.status(400).json({ success: false, message: "Please fill all required fields." });
            return;
        }

        // Validate and Convert tourId & trekId
        let validTourId = tourId && mongoose.isValidObjectId(tourId) ? new mongoose.Types.ObjectId(tourId) : null;
        let validTrekId = trekId && mongoose.isValidObjectId(trekId) ? new mongoose.Types.ObjectId(trekId) : null;

        if ((tourId && !validTourId) || (trekId && !validTrekId)) {
            res.status(400).json({ success: false, message: "Invalid Tour ID or Trek ID format." });
            return;
        }

        // Store Quote
        let quote = await CustomizeQuote.create({
            name,
            email,
            number,
            message,
            tourName,
            type,
            tourId: validTourId,
            trekName,
            trekId: validTrekId,
        });

        if (!quote) {
            res.status(500).json({ success: false, message: "Failed to add customize quote." });
            return;
        }

        // Email Configuration
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL as string,
                pass: process.env.PASSWORD as string
            }
        });

        const mailOptions = {
            from: `Quote Request - Nepal Luxury Escapes <${process.env.EMAIL}>`,
            to: process.env.EMAIL,
            replyTo: email,
            subject: 'New Customize Quote Request',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background-color: #ffffff; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); border-left: 6px solid #E8B86D;">
                    <h2 style="color: #333; text-align: center; border-bottom: 2px solid #E8B86D; padding-bottom: 10px;">New Quote Request</h2>
                    <p style="font-size: 18px; color: #444;"><strong>Name:</strong> ${name}</p>
                    <p style="font-size: 18px; color: #444;"><strong>Email:</strong> ${email}</p>
                    <p style="font-size: 18px; color: #444;"><strong>Number:</strong> ${number}</p>
                    ${tourName ? `<p style="font-size: 18px; color: #444;"><strong>Tour:</strong> ${tourName}</p>` : ""}
                    ${trekName ? `<p style="font-size: 18px; color: #444;"><strong>Trek:</strong> ${trekName}</p>` : ""}
                    <div style="background: #F8F1E7; padding: 15px; border-radius: 5px; font-size: 16px; color: #333; margin-top: 10px;">
                        <strong>Message:</strong>
                        <p style="margin-top: 5px; font-size: 16px;">${message}</p>
                    </div>
                    <p style="text-align: center; margin-top: 20px; font-size: 14px; color: #777;">
                        <i>You can reply to this email to respond to the client.</i>
                    </p>
                    <div style="text-align: center; margin-top: 20px;">
                        <a href="mailto:${email}" style="background-color: #E8B86D; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">Reply to Client</a>
                    </div>
                </div>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Email error:", error);
                res.status(500).json({ success: false, message: "Failed to send email." });
                return;
            }
            console.log("Email sent: " + info.response);
            res.status(200).json({ success: true, message: "Request added successfully.", data: quote });
        });

    } catch (error) {
        console.error("Error processing quote request:", error);
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Server error" });
    }
};

export default addCustomizeQuote;
