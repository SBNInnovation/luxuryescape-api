// routes/blogs/addBlog.routes.js
import express from "express";
import multer from "multer";
import addBlog, { MulterRequest } from "../../controllers/blogs/addBlog.controller.js";

const addBlogRouter = express.Router();

import path from "path";
import fs from "fs";

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

addBlogRouter.post("/blog/add-blog", uploader.single("thumbnail"), (req, res) => {
  console.log(req.file);
  addBlog(req as MulterRequest, res);
});

export default addBlogRouter;