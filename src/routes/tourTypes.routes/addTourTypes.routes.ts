import express from "express";
import addTourTypes from "../../controllers/tourTypes/addTourTypes.controller.js";

const addTourTypesRouter = express.Router();

addTourTypesRouter.route("/tour/add-tour-type").post(addTourTypes)


export default addTourTypesRouter;

