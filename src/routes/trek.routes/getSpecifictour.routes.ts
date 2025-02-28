import express from "express";
import getSpecificTrek from "../../controllers/treks/getSpecificTrek.controller.js";


const getSpecificTrekRouter = express.Router();

getSpecificTrekRouter.route("/trek/specific/:slug").get(getSpecificTrek);

export default getSpecificTrekRouter;
