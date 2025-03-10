import express from "express";
import deleteTours from "../../controllers/tours/deleteTours.controller.js";

const deleteTourRouter = express.Router();

deleteTourRouter.route("/tour/delete/:tourId").delete(deleteTours)

export default deleteTourRouter;