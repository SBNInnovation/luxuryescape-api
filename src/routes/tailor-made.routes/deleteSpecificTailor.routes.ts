import express from "express";
import deleteSpecificTailor from "../../controllers/tailor-made/deleteTailor-made.controller.js";


const deleteTailorRouter = express.Router();

deleteTailorRouter.route("/tailor-made/delete/:tailorId").delete(deleteSpecificTailor)

export default deleteTailorRouter;
