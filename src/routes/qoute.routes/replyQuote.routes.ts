import express from "express";
import replyToClient from "../../controllers/customizeQuotes/replyQuote.controller.js";


const replyQuoteRouter = express.Router();

// Route for admin to reply to client
replyQuoteRouter.post("/quote/reply-to-client", replyToClient);

export default replyQuoteRouter;
