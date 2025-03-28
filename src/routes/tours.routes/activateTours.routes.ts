import express from "express";
import updateActiveStatus from "../../controllers/tours/updateAcitvation.controller.js";

const activeteTourRouter = express.Router();

activeteTourRouter.route("/tour/activate-tour").patch(updateActiveStatus)

export default activeteTourRouter;