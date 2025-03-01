import express from "express";
import getAllTreks from "../../controllers/treks/getAllTrek.controller.js";



const getAllTrekRouter = express.Router();

getAllTrekRouter.route("/trek/get-all").get(getAllTreks);
// get all 

export default getAllTrekRouter;
