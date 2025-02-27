import express from "express";
import getAllTailorRequest from "../../controllers/tailor-made/getAllTailor.controller.js";

const getAllTailormadeRouter = express.Router();

getAllTailormadeRouter.route("/tailor-made/get").get(getAllTailorRequest);

export default getAllTailormadeRouter