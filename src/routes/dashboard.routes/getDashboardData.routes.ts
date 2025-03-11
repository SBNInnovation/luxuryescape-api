import express from "express";
import getDetailsForDashboard from "../../controllers/dashboard/getDashboardDetails.controller.js";

const getDashboardDataRouter = express.Router();

getDashboardDataRouter.route("/dashboard").get(getDetailsForDashboard)


export default getDashboardDataRouter;