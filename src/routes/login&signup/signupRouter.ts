import express from "express";
import registerUser from "../../controllers/login&signup/signupController.js";

const signupRouter = express.Router();

signupRouter.route("/signup").post(registerUser)

export default signupRouter;