import { Request, Response } from "express";
import Register from "../../models/signup.models/register.js";
import bcrypt from "bcryptjs";

const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;
    const { name, email, phone, oldPassword, password, confirmPassword } = req.body;

    // Find the user by ID
    const user = await Register.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    // Check if the new password and confirm password match
    if (password && password !== confirmPassword) {
      res.status(400).json({ success: false, message: "Passwords do not match" });
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

    // Update only the fields provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    // Hash the new password if it's provided
    if (password) {
      const hashedPassword = bcrypt.hashSync(password, 10);
      user.password = hashedPassword;
    }
    await user.save();

    // Return success response
    res.status(200).json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default updateProfile;
