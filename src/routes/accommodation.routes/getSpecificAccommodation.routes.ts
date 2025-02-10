import express from "express";
import getSpecificAccommodation from "../../controllers/accommodations/getAccommodationById.controller.js";

const getSpecificAccommodationRouter = express.Router();

getSpecificAccommodationRouter.route("/accommodation/get/:accommodationId").get(getSpecificAccommodation)

export default getSpecificAccommodationRouter