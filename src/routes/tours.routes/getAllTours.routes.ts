import express from "express";
import getAllTours from "../../controllers/tours/getAllTours.controllers.js";

const getAllTourRouter = express.Router();

getAllTourRouter.route("/tour/get-all").get(getAllTours)

export default getAllTourRouter;