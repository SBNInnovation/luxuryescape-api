import express from "express";
import getSpecificBlog from "../../controllers/blogs/getSpecificBlog.controller.js";

const getSpecificBlogRouter = express.Router()

getSpecificBlogRouter.route("/blog/get-specific-blog/:slug").get(getSpecificBlog)

export default getSpecificBlogRouter