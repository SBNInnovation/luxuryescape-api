import express from "express";
import getSpecifictour from "../../controllers/tours/getSpecifictour.controller.js";

const getSpecifictourRouter = express.Router();

getSpecifictourRouter.route("/tour/specific/:slug").get(getSpecifictour)

export default getSpecifictourRouter;