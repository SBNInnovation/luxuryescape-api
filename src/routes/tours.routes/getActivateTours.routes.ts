import express from "express";
import getToursByActivate from "../../controllers/tours/getToursByActivate.controller.js";

const getActivateTourRouter = express.Router();

getActivateTourRouter.route("/get-activated-tours").get(getToursByActivate)

export default getActivateTourRouter