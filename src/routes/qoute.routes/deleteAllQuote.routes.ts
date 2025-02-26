import express from "express";
import deleteAllQuote from "../../controllers/customizeQuotes/deleteAllQuote.controller.js";


const deleteAllQuoteRouter = express.Router();

deleteAllQuoteRouter.route("/quote/delete-all").delete(deleteAllQuote)

export default deleteAllQuoteRouter;
