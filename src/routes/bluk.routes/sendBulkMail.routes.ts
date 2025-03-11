import express from "express"
const bulkmailRouter = express.Router()

import multer from "multer"
import bulkMailing from "../../controllers/blukmail/replyBulkMail.controller.js"

const uploader = multer({
  storage: multer.diskStorage({}),
})

interface MulterRequest extends express.Request {
  files: {
    attachments: Express.Multer.File[]
  }
}

const uploadFields = [{ name: "attachments", maxCount: 5 }]

bulkmailRouter.post("/send-bulk-mail", uploader.fields(uploadFields), (req, res) => {
  bulkMailing(req as MulterRequest, res)
})

export default bulkmailRouter