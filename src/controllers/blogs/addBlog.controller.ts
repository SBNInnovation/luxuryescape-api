import { Request, Response } from "express";
import Blog from "../../models/blogs.models/blogs.js";
import { uploadFile } from "../../utility/cloudinary.js";
import slugify from "slugify";


export interface MulterRequest extends Request {
  file?: Express.Multer.File | undefined;
}

const addBlog = async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    const { title, description, category, link } = req.body;

    // Validate required fields
    if (!title || !description || !category) {
      res.status(400).json({ success: false, message: "Please fill all required fields." });
      return;
    }

    // Validate and parse link array
    let parsedLink: string[] = [];
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

    // Handle thumbnail upload
    let uploadedThumbnailUrl = "";
    if (req.file) {
      try {
        const uploadedThumbnail = await uploadFile(req.file.path, "blogs/thumbnail");
        if (uploadedThumbnail?.secure_url) {
          uploadedThumbnailUrl = uploadedThumbnail.secure_url;
        } else {
          res.status(500).json({ success: false, message: "Thumbnail upload failed." });
          return;
        }
      } catch (error) {
        console.error("Error uploading thumbnail:", error);
        res.status(500).json({ success: false, message: "Failed to upload thumbnail." });
        return;
      }
    }

    // Generate unique slug
    const baseSlug = slugify(title)
    let slug1 = baseSlug;
    let count = 1;
    while (await Blog.findOne({ slug1 })) {
      slug1 = `${baseSlug}-${count}`;
      count++;
    }

    // Calculate read time (1 min for every 200 words)
    const wordCount = description.split(/\s+/).length;
    const generateReadTime = Math.max(1, Math.ceil(wordCount / 200));

    // Create new blog entry
    const newBlog = await Blog.create({
      title,
      slug:slug1,
      description,
      category,
      link: parsedLink,
      thumbnail: uploadedThumbnailUrl,
      readTime: `${generateReadTime} min read`,
    });

    res.status(201).json({ success: true, message: "Blog created successfully.", data: newBlog });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ success: false, message: "An unexpected error occurred." });
  }
};

export default addBlog;
