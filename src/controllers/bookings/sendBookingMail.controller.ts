import { Request, Response } from "express";
import { Booking } from "../../models/booking.models/booking.js";
import { uploadFile } from "../../utility/cloudinary.js";
import { sendSingleEmail } from "../../middleware/mail.js";

interface MulterRequest extends Request {
  files: {
    attachments?: Express.Multer.File[];
  };
}

const sendBookingMail = async (req: MulterRequest, res: Response):Promise<void> => {
  try {
    const { recipient, subject, message, name, link } = req.body;
    const attachments = req.files?.attachments || [];

    const reqId = req.params.id;
    const updateRequest = await Booking.findById(reqId);

    if (!updateRequest) {
      res.status(404).json({ success: false, message: "Request not found" });
      return
    }

    if (!recipient || !subject || !message || !reqId) {
      res.status(400).json({ success: false, message: "All fields are required" });
      return
    }

    const uploadedFiles: string[] = [];
    if (attachments.length > 0) {
      const uploadPromises = attachments.map(async (file) => {
        const upload = await uploadFile(file.path, "/bookings");
        return upload ? upload.secure_url : null;
      });
      const uploadResults = await Promise.all(uploadPromises);
      uploadedFiles.push(...uploadResults.filter((url): url is string => url !== null));
    }

    const mailContent = `
<div style="font-family: 'Poppins', sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f8f8; padding: 25px; border-radius: 10px; color: #1a1a1a;">
  <div style="background-color:#C19A6B; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="margin: 0; font-size: 24px; color: white; font-weight: 600;">Nepal Luxury Escape</h1>
  </div>
  
  <div style="background-color: #f8f8f8; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 12px rgba(255,255,255,0.1);">
    <h2 style="color: #C19A6B; margin-bottom: 20px; font-size: 20px; font-weight: 500;">
      Payment Request: ${name ? name : recipient}
    </h2>
    
    <p style="color: #1a1a1a; line-height: 1.7; margin-bottom: 20px; font-size: 15px;">
      ${message}
    </p>

    ${link ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${link}" style="background-color: #C19A6B; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block; transition: background-color 0.3s;">Make Payment</a>
    </div>
    ` : ""}
    
    <div style="background-color: #222; padding: 15px; border-radius: 8px; margin-top: 25px; border-left: 4px solid #C19A6B;">
      <p style="color: #d4d4d4; line-height: 1.6; margin: 0; font-size: 14px;">
        <strong>Note:</strong> Please complete your payment to secure your luxury booking. If you have any questions about this payment, please contact our support team at <a href="mailto:info@goingnepal.com" style="color: #C19A6B; text-decoration: none;">support@nepalluxuryescape.com</a>.
      </p>
    </div>
    
    ${uploadedFiles.length > 0 ? `
    <div style="background-color: #1a1a1a; border: 1px solid #C19A6B; padding: 20px; border-radius: 8px; margin-top: 25px;">
      <h3 style="color: #C19A6B; margin-bottom: 15px; font-size: 16px; font-weight: 500;">Payment Documents:</h3>
      ${uploadedFiles.map((file) => `
        <div style="display: flex; align-items: center; margin-bottom: 10px;">
          <span style="color: #C19A6B; margin-right: 8px;">📄</span>
          <a href="${file}" style="color: #C19A6B; text-decoration: none; overflow: hidden; text-overflow: ellipsis; font-size: 14px;">
            ${file.split("/").pop()}
          </a>
        </div>
      `).join("")}
    </div>
    ` : ""}
  </div>
  
  <div style="text-align: center; padding: 20px 0 0;">
    <p style="color: #a0a0a0; font-size: 13px; margin-bottom: 10px;">
      © ${new Date().getFullYear()} Nepal Luxury Escape. All rights reserved.
    </p>
    <div style="margin-top: 15px;">
      <a href="https://www.facebook.com/nepalluxuryescapes" style="color: #C19A6B; text-decoration: none; margin: 0 10px; font-size: 13px;">Facebook</a>
      <a href="https://www.instagram.com/goingnepal/" style="color: #C19A6B; text-decoration: none; margin: 0 10px; font-size: 13px;">Instagram</a>
      <a href="https://www.nepalluxuryescapes.com/contact" style="color: #C19A6B; text-decoration: none; margin: 0 10px; font-size: 13px;">Contact Us</a>
    </div>
  </div>
</div>
`;

    sendSingleEmail(recipient, subject, mailContent);
    updateRequest.status = "mailed";
    await updateRequest.save();

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
      attachmentCount: uploadedFiles.length,
      updateRequest,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
    return
  }
};

export default sendBookingMail;