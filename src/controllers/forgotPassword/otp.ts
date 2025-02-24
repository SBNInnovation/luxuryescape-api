import { Request, Response } from "express";
import Register from "../../models/signup.models/register.js";
import { generateOtp, sendOtpEmail } from "../../middleware/forgotPassword.js";
import jwt, { JwtPayload } from "jsonwebtoken"
import bcrypt from "bcryptjs"

const sendotp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ success: false, message: "Email is required" });
      return;
    }

    const findValidUser = await Register.findOne({ email });
    if (!findValidUser) {
      res.status(404).json({ success: false, message: "Email is not registered" });
      return;
    }

    const otp = generateOtp(4);
    if (!otp) {
      res.status(500).json({ success: false, message: "Failed to generate OTP" });
      return;
    }

    const fpwToken = jwt.sign({ email }, process.env.FPW_SECRET_KEY as string, { expiresIn: '15m' });

    findValidUser.otp = otp;
    await findValidUser.save();

    sendOtpEmail(email, otp);

    res.status(200).json({ success: true, message: "OTP sent successfully", fpwToken });

  } catch (error) {
    console.error('Error in sendOtp:', error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { otp } = req.body;
    const { fpwToken } = req.query;

    // Check if OTP and fpwToken are provided
    if (!otp || !fpwToken || typeof fpwToken !== 'string') {
      res.status(400).json({ success: false, message: "OTP and token are required" });
      return
    }

    // Decode and verify the token
    let decodedToken: JwtPayload;
    try {
      decodedToken = jwt.verify(fpwToken, process.env.FPW_SECRET_KEY as string) as JwtPayload;
    } catch (error) {
      res.status(401).json({ success: false, message: "Invalid or expired token" });
      return
    }

    // Find user by email (decoded from the token)
    const user = await Register.findOne({ email: decodedToken.email });
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return
    }

    // Verify if the OTP matches
    if (user.otp !== otp) {
      res.status(400).json({ success: false, message: "Invalid OTP" });
      return
    }

    // Clear OTP after successful verification
    user.otp = "";
    await user.save();

    // Generate a new token for password reset
    const newPasswordToken = jwt.sign({ email: user.email }, process.env.NEW_PASSWORD_KEY as string, { expiresIn: '1h' });

    // Send success response with new token
    res.status(200).json({ success: true, message: "OTP verified successfully", token: newPasswordToken });
    return
  } catch (error) {
    console.error(error);  // Log the error to the console
    res.status(500).json({ success: false, message: "Internal server error", error});
    return
  }
};


const generatePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { password } = req.body;
      const { token } = req.query;
  
      if (!password || !token || typeof token !== 'string') {
        res.status(400).json({ success: false, message: "Password and token are required" });
        return;
      }
  
      let decodedToken: JwtPayload;
      try {
        decodedToken = jwt.verify(token, process.env.FPW_SECRET_KEY as string) as JwtPayload;
      } catch (error) {
        res.status(401).json({ success: false, message: "Invalid or expired token" });
        return;
      }
  
      const salt = await bcrypt.genSalt(10); // Increased from 10 to 12 for better security
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const user = await Register.findOneAndUpdate(
        { email: decodedToken.email },
        { 
          password: hashedPassword
        },
        { new: true, select: 'email name' } // Only return email and name fields
      );
  
      if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }
  
      res.status(200).json({
        success: true,
        message: "Password updated successfully",
        user: { email: user.email, name: user.name }
      });
  
    } catch (error) {
      console.error('Error in generatePassword:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
export {sendotp,verifyOtp,generatePassword};