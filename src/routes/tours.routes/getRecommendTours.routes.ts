import express from "express";
import getToursByActivate from "../../controllers/tours/getToursByActivate.controller.js";

const getRecommendTourRouter = express.Router();

getRecommendTourRouter.route("/get-recommended-tours").get(getToursByActivate)

export default getRecommendTourRouter