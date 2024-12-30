import express from "express";
import getToursByActivate from "../../controllers/tours/getToursByActivate.controller";

const getActivateTourRouter = express.Router();

getActivateTourRouter.route("/get-activate-tours").get(getToursByActivate)

export default getActivateTourRouter