import express from "express";
import loginUser from "../../controllers/login&signup/loginController.js";
import updateProfile from "../../controllers/login&signup/editProfile.js";

const loginRouter = express.Router()

loginRouter.route("/login").post(loginUser)
loginRouter.route("/profile/edit/:userId").patch(updateProfile)


export default loginRouter