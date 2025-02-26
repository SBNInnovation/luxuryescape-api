import express from "express";
import getAllQuote from "../../controllers/customizeQuotes/getAllQuote.controller.js";

const getAllQuoteRouter = express.Router();

getAllQuoteRouter.route("/quote/get").get(getAllQuote);

export default getAllQuoteRouter;