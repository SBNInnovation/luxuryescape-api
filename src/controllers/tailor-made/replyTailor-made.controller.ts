import { Request, Response } from "express";
import nodemailer from "nodemailer";
import TailorMade from "../../models/tailor-made.models/tailor-made.js";


const replyToTailormade = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, subject, message } = req.body;

        if (!email || !subject || !message) {
            res.status(400).json({ success: false, message: "Please provide all fields." });
            return;
        }

        // Find the tailor-made request by email
        const tailorMadeRequest = await TailorMade.findOne({ email });

        if (!tailorMadeRequest) {
            res.status(404).json({ success: false, message: "Unable to find the request" });
            return;
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL as string, // Admin email
                pass: process.env.PASSWORD as string,
            },
        });

        const attachments = req.file
            ? [{ filename: req.file.originalname, content: req.file.buffer }]
            : [];

        const mailOptions = {
            from: `Nepal Luxury Escapes <${process.env.EMAIL}>`,
            to: email, // Send reply to the client
            subject,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background-color: #ffffff; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); border-left: 6px solid #E8B86D;">
                    <h2 style="color: #333; text-align: center; border-bottom: 2px solid #E8B86D; padding-bottom: 10px;">Reply from Nepal Luxury Escapes</h2>
                    <p style="font-size: 18px; color: #444; line-height: 1.6;"><strong>Dear ${tailorMadeRequest.lastName},</strong></p>
                    <p style="font-size: 16px; color: #444; line-height: 1.6;">${message}</p>
                    <p style="font-size: 16px; color: #777; margin-top: 10px;">
                        <i>If you have any further questions, feel free to reply to this email.</i>
                    </p>
                    <div style="text-align: center; margin-top: 20px;">
                        <a href="mailto:${process.env.EMAIL}" style="background-color: #E8B86D; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">Contact Us</a>
                    </div>
                </div>
            `,
            attachments,
        };

        // Send email
        await transporter.sendMail(mailOptions);
        
        // Update status to "mailed"
        tailorMadeRequest.status = "mailed";
        await tailorMadeRequest.save();

        res.status(200).json({ success: true, message: "Reply sent successfully." });
    } catch (error) {
        console.error("Error sending reply:", error);
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Server error" });
    }
};

export default replyToTailormade;
