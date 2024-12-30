import express from "express";
import authenticate from "../../middleware/tokenAuth";
import activateTours from "../../controllers/tours/activatTours.controllers";

const activeteTourRouter = express.Router();

activeteTourRouter.route("/activate-tour").post(authenticate,activateTours)

export default activeteTourRouter;