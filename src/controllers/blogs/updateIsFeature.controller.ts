import { Request, Response } from "express";
import Blog from "../../models/blogs.models/blogs.js";

const updateFeatureStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { isFeature } = req.query; // Query param from request
        const { blogId } = req.params;  // Blog ID from URL params

        if (!blogId) {
            res.status(400).json({ success: false, message: "Blog ID is required" });
            return;
        }

        if (isFeature === undefined) {
            res.status(400).json({ success: false, message: "isFeature query parameter is required" });
            return;
        }

        // Convert query param to boolean properly
        const isFeatureBool = isFeature === "true";

        const findBlog = await Blog.findById(blogId);
        if (!findBlog) {
            res.status(404).json({ success: false, message: "Blog not found" });
            return;
        }

        const updateStatus = await Blog.findByIdAndUpdate(
            blogId,
            { $set: { isFeature: isFeatureBool } },
            { new: true }
        );

        if (!updateStatus) {
            res.status(400).json({ success: false, message: "Failed to update status" });
            return;
        }

        res.status(200).json({ 
            success: true, 
            message: `Blog status updated to ${isFeatureBool ? "Active" : "Inactive"}`, 
            data: updateStatus 
        });

    } catch (error) {
        console.error("Error updating blog status:", error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal server error",
        });
    }
};

export default updateFeatureStatus;
