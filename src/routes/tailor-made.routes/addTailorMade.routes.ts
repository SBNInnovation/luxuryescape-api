import express from "express";
import addTailormade from "../../controllers/tailor-made/addTailor-made.controller.js";

const addTailormadeRouter = express.Router();

addTailormadeRouter.route("/tailor-made/add").post(addTailormade);

export default addTailormadeRouter