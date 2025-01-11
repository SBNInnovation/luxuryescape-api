import express from "express";
import getSpecifictour from "../../controllers/tours/getSpecifictour.controller.js";

const getSpecifictourRouter = express.Router();

getSpecifictourRouter.route("/get-specific-tour/:tourId").get(getSpecifictour)

export default getSpecifictourRouter;