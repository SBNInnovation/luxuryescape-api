import express from "express";
import getSpecificTailor from "../../controllers/tailor-made/getSpecificTailor.controller.js";



const getSpecificTailorRouter = express.Router();

getSpecificTailorRouter.route("/tailor-made/specific/:tailorId").get(getSpecificTailor);

export default getSpecificTailorRouter;