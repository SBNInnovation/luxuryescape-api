import express from "express";
import getAllAccommodation from "../../controllers/accommodations/getAllAccommodation.controller.js";

const getAllAccommodationRouter = express.Router();

getAllAccommodationRouter.route("/accommodation/get-all-accommodation").get(getAllAccommodation)

export default getAllAccommodationRouter;