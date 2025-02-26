import { Request, Response } from "express";
import Contact from "../../models/contact.models/contact.js";
import nodemailer from "nodemailer";

const addContact = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, number, message } = req.body;

        if (!name || !email || !number || !message) {
            res.status(400).json({ success: false, message: "Please fill all fields." });
            return;
        }

        const contact = await Contact.create({ name, email, number, message });

        if (!contact) {
            res.status(400).json({ success: false, message: "Failed to add contact." });
            return;
        }

        // Email configuration
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL as string, // Admin email
                pass: process.env.PASSWORD as string
            }
        });

        const mailOptions = {
            from: `Contact Inquiry Nepal Luxury Escapes <${process.env.EMAIL}>`,
            to: process.env.EMAIL,
            replyTo: email,
            subject: 'New Contact Inquiry',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background-color: #ffffff; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); border-left: 6px solid #E8B86D;">
                    <h2 style="color: #333; text-align: center; border-bottom: 2px solid #E8B86D; padding-bottom: 10px;">New Contact Inquiry</h2>
                    <p style="font-size: 18px; color: #444; line-height: 1.6;"><strong>Name:</strong> ${name}</p>
                    <p style="font-size: 18px; color: #444; line-height: 1.6;"><strong>Email:</strong> ${email}</p>
                    <p style="font-size: 18px; color: #444; line-height: 1.6;"><strong>Number:</strong> ${number}</p>
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
            res.status(200).json({ success: true, message: "Contact added successfully.", data: contact });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Server error" });
    }
};

export default addContact;
