import express from "express";
import registerUser from "../../controllers/login&signup/signupController";

const signupRouter = express.Router();

signupRouter.route("/signup").post(registerUser)

export default signupRouter;