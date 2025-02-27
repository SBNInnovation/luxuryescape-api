import express from "express";


const replyTailerRouter = express.Router();

import multer from "multer";
import replyToTailormade from "../../controllers/tailor-made/replyTailor-made.controller.js";

// Configure storage (memory storage for buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Apply middleware to your route
replyTailerRouter.post("/tailor-made/reply-to-client", upload.single("attachments"), replyToTailormade);


export default replyTailerRouter
