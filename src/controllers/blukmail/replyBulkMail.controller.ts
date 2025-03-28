import { Request, Response } from "express"
import { sendBulkEmail } from "../../middleware/mail.js"
import { uploadFile } from "../../utility/cloudinary.js"

interface MulterRequest extends Request {
  files: {
    attachments?: Express.Multer.File[]
  }
}

const bulkMailing = async (req: MulterRequest, res: Response) => {
  try {
    let { emails, subject, message } = req.body;  // ✅ Use "let" instead of "const"
    const attachments = req.files?.attachments || [];

    if (!emails || emails.length === 0 || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide emails, subject, and message.",
      });
    }

    // ✅ Ensure emails is an array
    if (typeof emails === "string") {
      try {
        emails = JSON.parse(emails);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format. Ensure it's a valid JSON array.",
        });
      }
    }

    if (!Array.isArray(emails)) {
      return res.status(400).json({
        success: false,
        message: "Emails should be an array.",
      });
    }

    const uploadedFiles: string[] = []
    if (attachments.length > 0) {
      for (let i = 0; i < attachments.length; i++) {
        const upload = await uploadFile(
          attachments[i].path,
          "/bulk-mail"
        )
        if (upload) {
          uploadedFiles.push(upload.secure_url)
        }
      }
    }

    // Create email content
    const createMailContent = (message: string, uploadedFiles: string[]) => {
      return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f6; padding: 20px; border-radius: 8px;">
  <div style="background-color: #E8B86D; color: white; padding: 15px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">Nepal Luxury Escape</h1>
  </div>
  
  <div style="background-color: white; padding: 25px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <h2 style="color: # #E8B86D; margin-bottom: 15px; font-size: 20px;">
      Hello sir/madam,
    </h2>
    
    <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
      ${message}
    </p>
    
    ${
      uploadedFiles.length > 0
        ? `
        <div style="background-color: #F3F4F6; border-top: 1px solid #E5E7EB; padding: 15px; border-radius: 8px; margin-top: 20px;">
          <h3 style="color:rgb(92, 94, 2); margin-bottom: 10px; font-size: 16px;">Attached Files:</h3>
          ${uploadedFiles
            .map(
              (file) => `
            <a href="${file}" style="color:  #E8B86D; text-decoration: none; display: block; margin-bottom: 5px; overflow: hidden; text-overflow: ellipsis;">
              📄 ${file.split("/").pop()}
            </a>
          `
            )
            .join("")}
        </div>
        `
        : ""
    }
  </div>
  
  <div style="text-align: center; color: #6B7280; padding: 10px; font-size: 12px;">
    © ${new Date().getFullYear()} Nepal Luxury Escape
  </div>
</div>
      `
    }


    await sendBulkEmail(
      emails,
      subject,
      createMailContent(message, uploadedFiles)
    )

    res.status(200).json({
      success: true,
      message: "All emails sent successfully.",
    })
  } catch (error) {
    console.error("Error in bulk mailing:", error)
    res.status(500).json({
      success: false,
      message: "An error occurred while sending emails.",
    })
  }
}

export default bulkMailing