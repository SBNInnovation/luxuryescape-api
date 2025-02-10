import express from "express";
import updateStatus from "../../controllers/blogs/updateStatus.controller.js";

const updateBlogStatusRouter = express.Router();

updateBlogStatusRouter.route("/blog/update-status/:blogId").patch(updateStatus);

export default updateBlogStatusRouter;