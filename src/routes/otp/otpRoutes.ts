import express from "express";
import {generatePassword, sendotp, verifyOtp} from "../../controllers/forgotPassword/otp";

const otpRouter = express.Router();

otpRouter.route("/forgot-password").post(sendotp)
otpRouter.route("/verify-otp").post(verifyOtp)
otpRouter.route("/add-new-password").patch(generatePassword);

export default otpRouter