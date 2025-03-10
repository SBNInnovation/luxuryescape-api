import express from "express";
import deleteTrek from "../../controllers/treks/deleteTrek.controller.js";


const deleteTrekRouter = express.Router();

deleteTrekRouter.route("/trek/delete/:trekId").delete(deleteTrek)

export default deleteTrekRouter;