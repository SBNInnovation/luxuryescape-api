import express from "express";
import updateActiveStatus from "../../controllers/treks/activate.controller.js";


const activeteTrekRouter = express.Router();

activeteTrekRouter.route("/trek/activate-trek").patch(updateActiveStatus)

export default activeteTrekRouter;