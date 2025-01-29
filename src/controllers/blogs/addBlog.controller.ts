import { Request, Response } from "express";
import Blog from "../../models/blogs.models/blogs.js";

const addBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      category,
      link,
    } = req.body;

    // Validate required fields
    if (!title || !description || !category) {
      res.status(400).json({ success: false, message: "Please fill all the fields" });
      return;
    }

    // Parse links if it's in string form
    let parsedLink;
    try {
      parsedLink = JSON.parse(link);
    } catch (error) {
      res.status(400).json({ success: false, message: "Invalid link format" });
      return;
    }

    if (!Array.isArray(parsedLink)) {
      res.status(400).json({ success: false, message: "Please enter a valid array of links" });
      return;
    }

    // Handle file uploads using Multer
    const thumbnail = req.file?.path || "";
    if (!thumbnail) {
      res.status(400).json({ success: false, message: "Please upload a thumbnail" });
      return;
    }

    // Check if the blog already exists
    const checkExistingBlog = await Blog.findOne({ title });
    if (checkExistingBlog) {
      res.status(409).json({ success: false, message: "Blog already exists" });
      return;
    }

    // Calculate read time (rough estimate of number of words / 200 words per minute)
    const wordCount = description.split(" ").length;
    const generateReadTime = Math.floor(wordCount / 200);

    // Create the new blog
    const createBlog = await Blog.create({
      title,
      slug: title.toLowerCase().replace(/\s+/g, "-"),
      description,
      category,
      link: parsedLink,
    //   link,
      thumbnail : thumbnail || "",
      readTime: generateReadTime > 0 ? `${generateReadTime} min read` : "Less than a minute",
    });

    if (!createBlog) {
      res.status(500).json({ success: false, message: "Failed to create blog" });
      return;
    }

    // Respond with success
    res.status(201).json({ success: true, message: "Blog created successfully", data: createBlog });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export default addBlog;


