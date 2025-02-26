import express from "express";
import getSpecificQuote from "../../controllers/customizeQuotes/getSpecificQuote.controller.js";


const getSpecificQuoteRouter = express.Router();

getSpecificQuoteRouter.route("/quote/specific/:quoteId").get(getSpecificQuote);

export default getSpecificQuoteRouter;