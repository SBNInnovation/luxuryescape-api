import express from "express";
import getAllUserData from "../../controllers/blukmail/getUserData.controller.js";


const getAgentRouter = express.Router();

getAgentRouter.route("/agent/get").get(getAllUserData)

export default getAgentRouter;