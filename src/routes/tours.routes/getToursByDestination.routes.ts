import express from "express";
import getToursByDestination from "../../controllers/tours/getToursByDestination.controller.js";

const getToursByDestinationRouter = express.Router();

getToursByDestinationRouter.route("/tour/get-tour").get(getToursByDestination)

export default getToursByDestinationRouter