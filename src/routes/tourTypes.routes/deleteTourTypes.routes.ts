import express from "express";
import deleteTourType from "../../controllers/tourTypes/deleteTourTypes.controller.js";

const deleteTourTypeRouter = express.Router();

deleteTourTypeRouter.route("/tour-type/delete/:tourTypeId").delete(deleteTourType)

export default deleteTourTypeRouter;