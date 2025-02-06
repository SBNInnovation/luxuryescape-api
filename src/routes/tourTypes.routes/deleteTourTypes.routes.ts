import express from "express";
import deleteTourType from "../../controllers/tourTypes/deleteTourTypes.controller.js";

const deleteTourTypeRouter = express.Router();

deleteTourTypeRouter.route("tour/delete-tour-type").delete(deleteTourType)

export default deleteTourTypeRouter;