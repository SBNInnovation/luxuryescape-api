import express from "express";
import deleteAccommodation from "../../controllers/accommodations/deleteAccommodation.controller.js";

const deleteAccommodationRouter = express.Router();

deleteAccommodationRouter.route("/accommodation/delete/:accommodationId").delete(deleteAccommodation)

export default deleteAccommodationRouter