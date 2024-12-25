import express from "express";
import loginUser from "../../controllers/login&signup/loginController";

const loginRouter = express.Router()

loginRouter.route("/login").post(loginUser)


export default loginRouter