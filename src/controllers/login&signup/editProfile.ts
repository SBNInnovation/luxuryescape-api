import { Request, Response } from "express";
import Register from "../../models/signup.models/register.js";
import bcrypt from "bcryptjs";

const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;
    const { name, email, phone, oldPassword, password,
      location,
      contactNumbers,
      contactEmails,
      linkedInLink,
      twitterLink,
      facebookLink,
      instagramLink,
      youtubeLink,
      officeTimeStart,
      officeTimeEnd,
      otherWebsites
    } = req.body;

    // Find the user by ID
    const user = await Register.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    // Check if the old password is provided and valid
    if (oldPassword && password) {
      const checkPass = bcrypt.compareSync(oldPassword, user.password);
      if (!checkPass) {
        res.status(400).json({ success: false, message: "Old password is incorrect" });
        return;
      }
    }

    const parsedContactNumbers = typeof contactNumbers === "string"?
    JSON.parse(contactNumbers) : contactNumbers || [];

    const parsedContactEmails = typeof contactEmails === "string"?
    JSON.parse(contactEmails) : contactEmails || [];

    const parsedOtherWebsites = typeof otherWebsites === "string"?
    JSON.parse(otherWebsites) : otherWebsites || [];

    if(!Array.isArray(parsedContactEmails) || !Array.isArray(parsedContactNumbers) || !Array.isArray(parsedOtherWebsites)){
      res.status(400).json({ success: false, message: "Invalid contact information must be an array" });
    }
    
    // Update only the fields provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (location) user.location = location;
    if (contactNumbers) user.contactNumbers = parsedContactNumbers;
    if (contactEmails) user.contactEmails = parsedContactEmails;
    if (linkedInLink) user.linkedInLink = linkedInLink;
    if (twitterLink) user.twitterLink = twitterLink;
    if (facebookLink) user.facebookLink = facebookLink;
    if (instagramLink) user.instagramLink = instagramLink;
    if (youtubeLink) user.youtubeLink = youtubeLink;
    if (officeTimeStart) user.officeTimeStart = officeTimeStart;
    if (officeTimeEnd) user.officeTimeEnd = officeTimeEnd;
    if (otherWebsites) user.otherWebsites = parsedOtherWebsites;

    // Hash the new password if it's provided
    if (password) {
      const hashedPassword = bcrypt.hashSync(password, 10);
      user.password = hashedPassword;
    }
    await user.save();

    // Return success response
    res.status(200).json({ success: true, message: "Profile updated successfully"});
  } catch (error) {
    console.error(error);
    if(error instanceof(Error)){
      res.status(500).json({ success: false, message: error.message});
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default updateProfile;
