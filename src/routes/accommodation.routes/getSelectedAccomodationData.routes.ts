import express from "express";
import getSelectedAccommodationData from "../../controllers/accommodations/getSelectedAccommodationData.controller.js";

const getSelectedAccommodationDataRouter =express.Router();

getSelectedAccommodationDataRouter.route("/accommodation/get-selected-data").get(getSelectedAccommodationData);

export default getSelectedAccommodationDataRouter;