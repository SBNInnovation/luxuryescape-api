import express from "express";
import getSelectedDataForTrek from "../../controllers/treks/getSelectedTrekData.controller.js";



const getSelectedDataForTrekRouter = express.Router();

getSelectedDataForTrekRouter.route("/trek/get/selected").get(getSelectedDataForTrek);

export default getSelectedDataForTrekRouter;
