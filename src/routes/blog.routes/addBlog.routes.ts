// routes/blogs/addBlog.routes.js
import express from "express";
import multer from "multer";
import addBlog, { MulterRequest } from "../../controllers/blogs/addBlog.controller.js";

const addBlogRouter = express.Router();

const uploader = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/uploads/blogs");
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