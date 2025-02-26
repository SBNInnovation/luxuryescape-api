import express from "express";
import deleteSpecificQuote from "../../controllers/customizeQuotes/deleteQuote.controller.js";

const deleteQuoteRouter = express.Router();

deleteQuoteRouter.route("/quote/delete/:quoteId").delete(deleteSpecificQuote)

export default deleteQuoteRouter;
