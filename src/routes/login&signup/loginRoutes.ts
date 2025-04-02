import express from "express";
import loginUser from "../../controllers/login&signup/loginController.js";
import updateProfile from "../../controllers/login&signup/editProfile.js";
import getUserData from "../../controllers/login&signup/fetchUserData.controller.js";

const loginRouter = express.Router()

loginRouter.route("/login").post(loginUser)
loginRouter.route("/profile/edit/:userId").patch(updateProfile)
loginRouter.route("/profile/get/:userId").get(getUserData)


export default loginRouter