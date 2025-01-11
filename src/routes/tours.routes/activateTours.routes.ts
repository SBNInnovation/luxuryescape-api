import express from "express";
import authenticate from "../../middleware/tokenAuth.js";
import activateTours from "../../controllers/tours/activateTours.controllers.js";

const activeteTourRouter = express.Router();

activeteTourRouter.route("/activate-tour").post(authenticate,activateTours)

export default activeteTourRouter;