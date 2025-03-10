import express from "express";
import authenticate from "../../middleware/tokenAuth.js";
import activateTours from "../../controllers/tours/activateTours.controllers.js";

const activeteTourRouter = express.Router();

activeteTourRouter.route("/tour/activate-tour").post(activateTours)

export default activeteTourRouter;