import express from "express";
import deleteTours from "../../controllers/tours/deleteTours.controller";

const deleteTourRouter = express.Router();

deleteTourRouter.route("/tour/delete/:tourID").delete(deleteTours)

export default deleteTourRouter;