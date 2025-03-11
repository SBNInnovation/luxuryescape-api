import express from "express";
import editAgent from "../../controllers/blukmail/editAgent.controller.js";

const editAgentRouter = express.Router();

editAgentRouter.route("/agent/edit/:agentId").patch(editAgent)

export default editAgentRouter;