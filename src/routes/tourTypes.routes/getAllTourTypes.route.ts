import express from "express";
import getAllTourTypes from "../../controllers/tourTypes/getAllTourTypes.controller.js";

const getAllTourTypesRouter = express.Router();

getAllTourTypesRouter.route("/tour/get-all-tour-types").get(getAllTourTypes);

export default getAllTourTypesRouter