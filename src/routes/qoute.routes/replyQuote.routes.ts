import express from "express";
import replyToClient from "../../controllers/customizeQuotes/replyQuote.controller.js";

const replyQuoteRouter = express.Router();

import multer from "multer";

// Configure storage (memory storage for buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Apply middleware to your route
replyQuoteRouter.post("/quote/reply-to-client", upload.single("attachments"), replyToClient);


export default replyQuoteRouter
