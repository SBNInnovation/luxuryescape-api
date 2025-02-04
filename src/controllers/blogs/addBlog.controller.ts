// import { Request, Response } from "express";
// import Blog from "../../models/blogs.models/blogs.js";
// import { MulterRequest } from "../tourTypes/addTourTypes.controller.js";

// const addBlog = async (req: MulterRequest, res: Response): Promise<void> => {
//   try {
//     const {
//       title,
//       description,
//       category,
//       link,
//     } = req.body;

//     // Validate required fields
//     if (!title || !description || !category) {
//        res.status(400).json({
//         success: false,
//         message: "Please fill all the required fields (title, description, and category).",
//       });
//       return
//     }

//     // Parse links if it's in string form
//     let parsedLink;
//     try {
//       parsedLink = JSON.parse(link);
//     } catch (error) {
//        res.status(400).json({ success: false, message: "Invalid link format." });
//        return
//     }

//     if (!Array.isArray(parsedLink)) {
//        res.status(400).json({
//         success: false,
//         message: "Links should be in the form of an array.",
//       });
//       return
//     }

//     // Handle file uploads using Multer
//     const thumbnail = req.file?.path || "";
//     if (!thumbnail) {
//        res.status(400).json({ success: false, message: "Thumbnail image is required." });
//        return
//     }

//     // Check if the blog already exists
//     const checkExistingBlog = await Blog.findOne({ title });
//     if (checkExistingBlog) {
//        res.status(409).json({
//         success: false,
//         message: "A blog with this title already exists. Please choose a different title.",
//       });
//       return
//     }

//     // Calculate read time (rough estimate of number of words / 200 words per minute)
//     const wordCount = description.split(" ").length;
//     const generateReadTime = Math.floor(wordCount / 200);

//     // Create the new blog
//     const createBlog = await Blog.create({
//       title,
//       slug: title.toLowerCase().replace(/\s+/g, "-"),
//       description,
//       category,
//       link: parsedLink,
//       thumbnail: thumbnail || "",
//       readTime: generateReadTime > 0 ? `${generateReadTime} min read` : "Less than a minute",
//     });

//     if (!createBlog) {
//        res.status(500).json({
//         success: false,
//         message: "An error occurred while creating the blog. Please try again.",
//       });
//       return
//     }

//     // Respond with success
//      res.status(201).json({
//       success: true,
//       message: "Blog created successfully.",
//       data: createBlog,
//     });

//   } catch (error) {
//     console.error("Error creating blog:", error);

//     // Check for specific errors or handle generic errors
//     if (error instanceof Error) {
//        res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//       return
//     }

//     // Fallback for any unknown errors
//      res.status(500).json({
//       success: false,
//       message: "An unexpected error occurred. Please try again.",
//     });
//     return
//   }
// };

// export default addBlog;


import { Request, Response } from "express";
import Blog from "../../models/blogs.models/blogs.js";
import { MulterRequest } from "../tourTypes/addTourTypes.controller.js";
import { uploadFile } from "../../utility/cloudinary.js";

const addBlog = async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      category,
      link,
    } = req.body;

    // Validate required fields
    if (!title || !description || !category) {
       res.status(400).json({
        success: false,
        message: "Please fill all the required fields (title, description, and category).",
      });
      return
    }

    // Parse links if it's in string form
    let parsedLink;
    try {
      parsedLink = JSON.parse(link);
    } catch (error) {
       res.status(400).json({ success: false, message: "Invalid link format." });
       return
    }

    if (!Array.isArray(parsedLink)) {
       res.status(400).json({
        success: false,
        message: "Links should be in the form of an array.",
      });
      return
    }

    // Handle file uploads using Multer
    const thumbnail = req.file;

    if (!thumbnail) {
       res.status(400).json({ success: false, message: "Thumbnail image is required." });
       return
    }

    // Upload the thumbnail to cloudinary
    const uploadedThumbnail = await uploadFile(thumbnail.path, "blogs/thumbnail");

    // If the upload fails or s an error
    if (!uploadedThumbnail || !uploadedThumbnail.url) {
       res.status(500).json({
        success: false,
        message: "Failed to upload thumbnail image.",
      });
      return
    }

    // Check if the blog already exists
    const checkExistingBlog = await Blog.findOne({ title });
    if (checkExistingBlog) {
       res.status(409).json({
        success: false,
        message: "A blog with this title already exists. Please choose a different title.",
      });
      return
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
      // link,
      thumbnail: uploadedThumbnail?.secure_url || "", 
      readTime: generateReadTime > 0 ? `${generateReadTime} min read` : "Less than a minute",
    });

    if (!createBlog) {
       res.status(500).json({
        success: false,
        message: "An error occurred while creating the blog. Please try again.",
      });
      return
    }

    // Respond with success
     res.status(201).json({
      success: true,
      message: "Blog created successfully.",
      data: createBlog,
    });

  } catch (error) {
    console.error("Error creating blog:", error);

    // Check for specific errors or handle generic errors
    if (error instanceof Error) {
       res.status(500).json({
        success: false,
        message: error.message,
      });
      return
    }

    // Fallback for any unknown errors
     res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again.",
    });
  }
};

export default addBlog;

