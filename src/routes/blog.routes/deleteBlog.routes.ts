import express from "express";
import blogDelete from "../../controllers/blogs/deleteBlog.controller.js";

const deleteBlogRouter = express.Router();

deleteBlogRouter.route("/blog/delete/:blogId").delete(blogDelete);

export default deleteBlogRouter