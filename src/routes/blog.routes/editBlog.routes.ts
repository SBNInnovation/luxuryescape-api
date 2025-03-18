// routes/blogs/addBlog.routes.js
import express from "express";
import multer from "multer";

const editBlogRouter = express.Router();

import path from "path";
import fs from "fs";
import { MulterRequest } from "../../controllers/blogs/addBlog.controller.js";
import editBlog from "../../controllers/blogs/editBlog.controller.js";

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const uploadPath = path.resolve(process.cwd(),"public/uploads/blogs");

if(!fs.existsSync(uploadPath)){
  console.log("creating directory", uploadPath);
  fs.mkdirSync(uploadPath, {recursive:true});
}

const uploader = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

editBlogRouter.patch("/blog/edit/:blogId", uploader.single("thumbnail"), (req, res) => {
  console.log(req.file);
  editBlog(req as MulterRequest, res);
});

export default editBlogRouter;