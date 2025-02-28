import express from "express";
import getTourByTourTypes from "../../controllers/tours/getTourByTourTypes.controller.js";


const getTourByTourTypesRouter = express.Router();

getTourByTourTypesRouter.route("/tour/get/by-type/:tourTypeSlug").get(getTourByTourTypes);

export default getTourByTourTypesRouter;
