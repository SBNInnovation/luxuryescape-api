import express from "express";
import getSelectedData from "../../controllers/tours/getSelectedTourData.controllers.js";

const getSelectedDataRouter =express.Router();

getSelectedDataRouter.route("/tour/get/selected").get(getSelectedData);

export default getSelectedDataRouter;