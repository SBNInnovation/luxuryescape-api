import express from "express";
import globalSearch from "../../controllers/tours/getTourByTourTypes.controller.js";



const getTourByTourTypesRouter = express.Router();

getTourByTourTypesRouter.route("/all-search").get(globalSearch);

export default getTourByTourTypesRouter;
