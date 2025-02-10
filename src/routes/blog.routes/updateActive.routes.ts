import express from "express";
import updateActiveStatus from "../../controllers/blogs/updateIsActive.controller.js";

const updateActiveBlogStatus = express.Router();

updateActiveBlogStatus.route("/blog/update-status/:blogId").patch(updateActiveStatus);

export default updateActiveBlogStatus;