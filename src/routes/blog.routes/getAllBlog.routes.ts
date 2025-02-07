import express from "express";
import getAllBlogs from "../../controllers/blogs/getAllBlog.controller.js";

const getAllBlogRouter = express.Router();

getAllBlogRouter.route("/blog/get-all").get(getAllBlogs);

export default getAllBlogRouter