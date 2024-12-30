import express from "express";
import getAllTours from "../../controllers/tours/getAllTours.controllers";

const getAllTourRouter = express.Router();

getAllTourRouter.route("/get-all-tours").get(getAllTours)

export default getAllTourRouter;