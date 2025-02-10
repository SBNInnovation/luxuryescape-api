import { Request, Response } from "express";
import Blog from "../../models/blogs.models/blogs.js";
import { uploadFile } from "../../utility/cloudinary.js";

const editBlog = async (req: Request, res: Response): Promise<void> => {
    try {
        const slug = req.params.slug;
        const { title, description, category, link } = req.body;

        if (!title || !description || !category) {
            res.status(400).json({ success: false, message: "Please fill all required fields." });
            return;
        }

        // Find the existing blog
        const findPreviousData = await Blog.findOne({ slug });
        if (!findPreviousData) {
            res.status(404).json({ success: false, message: "Blog not found" });
            return;
        }

        // Preserve previous thumbnail if no new image is uploaded
        let uploadedThumbnailUrl = findPreviousData.thumbnail;

        if (req.file) {
            const uploadedThumbnail = await uploadFile(req.file.path, "blogs/thumbnail");
            if (uploadedThumbnail?.secure_url) {
                uploadedThumbnailUrl = uploadedThumbnail.secure_url;
            }
        }

        // Parse links if provided
        let parsedLink = [];
        if (link) {
            try {
                parsedLink = JSON.parse(link);
                if (!Array.isArray(parsedLink)) {
                    res.status(400).json({ success: false, message: "Links should be an array." });
                    return;
                }
            } catch (error) {
                res.status(400).json({ success: false, message: "Invalid link format." });
                return;
            }
        }

        // Calculate read time
        const wordCount = description.split(" ").length;
        const generateReadTime = Math.floor(wordCount / 200);

        // Update the blog
        const updatedBlog = await Blog.findOneAndUpdate(
            { slug },
            {
                $set: {
                    title,
                    description,
                    category,
                    link: parsedLink,
                    thumbnail: uploadedThumbnailUrl,
                    readTime: generateReadTime > 0 ? `${generateReadTime} min read` : "Less than a minute",
                }
            },
            { new: true }
        );

        res.status(200).json({ success: true, message: "Blog updated successfully", data: updatedBlog });

    } catch (error) {
        console.error("Error updating blog:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error instanceof Error ? error.message : "Unknown error" });
    }
};

export default editBlog;
