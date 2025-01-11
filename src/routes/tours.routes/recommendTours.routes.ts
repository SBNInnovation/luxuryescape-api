import express from "express";
import authenticate from "../../middleware/tokenAuth";
import recommendTours from "../../controllers/tours/recommendTours.controllers.js";


const recommendTourRouter = express.Router();

recommendTourRouter.route("/recommend-tour").post(authenticate,recommendTours)

export default recommendTourRouter;