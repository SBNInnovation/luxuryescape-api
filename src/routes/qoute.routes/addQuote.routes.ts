import express from "express";
import addCustomizeQuote from "../../controllers/customizeQuotes/addCustomizeQuote.controller.js";

const addQuoteRouter = express.Router();

addQuoteRouter.route("/quote/customize").post(addCustomizeQuote)

export default addQuoteRouter