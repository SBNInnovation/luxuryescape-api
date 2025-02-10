import express from "express";
import updateFeatureStatus from "../../controllers/blogs/updateIsFeature.controller.js";


const updateFeatureBlogStatus = express.Router();

updateFeatureBlogStatus.route("/blog/update-status/:blogId").patch(updateFeatureStatus);

export default updateFeatureBlogStatus;