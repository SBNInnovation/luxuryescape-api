import express from "express";
import addAgent from "../../controllers/blukmail/addAgent.controller.js";

const addAgentRouter = express.Router();

addAgentRouter.route("/agent/add").post(addAgent)

export default addAgentRouter;