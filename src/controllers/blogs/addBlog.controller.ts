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







// controllers/blogs/addBlog.controller.js
// import { Request, Response } from "express";
// import Blog from "../../models/blogs.models/blogs.js";
// import { uploadFile, deleteFile } from "../../utility/cloudinary.js";

// export interface MulterRequest extends Request {
//   file?: Express.Multer.File;
// }

// const addBlog = async (req: MulterRequest, res: Response): Promise<void> => {
//   try {
//     const { title, description, category, link } = req.body;

//     if (!title || !description || !category) {
//       res.status(400).json({ success: false, message: "Please fill all required fields." });
//       return;
//     }

//     let parsedLink = [];
//     if (link) {
//       try {
//         parsedLink = JSON.parse(link);
//         if (!Array.isArray(parsedLink)) {
//           res.status(400).json({ success: false, message: "Links should be an array." });
//           return;
//         }
//       } catch (error) {
//         res.status(400).json({ success: false, message: "Invalid link format." });
//         return;
//       }
//     }

//     const thumbnail = req.file || "";
//     if (!thumbnail) {
//       res.status(400).json({ success: false, message: "Thumbnail image is required." });
//       return;
//     }

//     const uploadedThumbnail = await uploadFile(thumbnail.path, "blogs/thumbnail");
//     if (!uploadedThumbnail || !uploadedThumbnail.secure_url) {
//       res.status(500).json({ success: false, message: "Failed to upload thumbnail image." });
//       return;
//     }

//     let slug = title.toLowerCase().replace(/\s+/g, "-");
//     let existingSlug = await Blog.findOne({ slug });
//     let count = 1;
//     while (existingSlug) {
//       slug = `${slug}-${count}`;
//       existingSlug = await Blog.findOne({ slug });
//       count++;
//     }

//     const wordCount = description.split(" ").length;
//     const generateReadTime = Math.floor(wordCount / 200);

//     try {
//       const createBlog = await Blog.create({
//         title,
//         slug,
//         description,
//         category,
//         link: parsedLink,
//         thumbnail: uploadedThumbnail.secure_url || "",
//         readTime: generateReadTime > 0 ? `${generateReadTime} min read` : "Less than a minute",
//       });

//       res.status(201).json({ success: true, message: "Blog created successfully.", data: createBlog });
//     } catch (error) {
//       await deleteFile(uploadedThumbnail.public_id);
//       res.status(500).json({ success: false, message: "An error occurred while creating the blog." });
//     }
//   } catch (error) {
//     console.error("Error creating blog:", error);
//     res.status(500).json({ success: false, message: "An unexpected error occurred." });
//   }
// };
// export default addBlog;



// import { Request, Response } from "express";
// import Blog from "../../models/blogs.models/blogs.js";
// import { uploadFile } from "../../utility/cloudinary.js";

// export interface MulterRequest extends Request {
//   file?: Express.Multer.File | undefined;
// }

// const addBlog = async (req: MulterRequest, res: Response): Promise<void> => {
//   try {
//     const { title, description, category, link } = req.body;

//     if (!title || !description || !category) {
//       res.status(400).json({ success: false, message: "Please fill all required fields." });
//       return;
//     }

//     let parsedLink = [];
//     if (link) {
//       try {
//         parsedLink = JSON.parse(link);
//         if (!Array.isArray(parsedLink)) {
//           res.status(400).json({ success: false, message: "Links should be an array." });
//           return;
//         }
//       } catch (error) {
//         res.status(400).json({ success: false, message: "Invalid link format." });
//         return;
//       }
//     }

//     let uploadedThumbnailUrl = ""; // Default empty string if no image is uploaded
//     if (req.file) {
//       // const uploadedThumbnail = await uploadFile(req.file.path, "blogs/thumbnail");
//       const uploadedThumbnail = await uploadFile(`${req.file.path}`, "blogs/thumbnail");  //Multer stores files locally (public/uploads/blogs), but Cloudinary needs an absolute path.
//       if (uploadedThumbnail?.secure_url) {
//         uploadedThumbnailUrl = uploadedThumbnail.secure_url;
//       }
//     }

//     let slug = title.toLowerCase().replace(/\s+/g, "-");
//     let existingSlug = await Blog.findOne({ slug });
//     let count = 1;
//     while (existingSlug) {
//       slug = `${slug}-${count}`;
//       existingSlug = await Blog.findOne({ slug });
//       count++;
//     }

//     const wordCount = description.split(" ").length;
//     const generateReadTime = Math.floor(wordCount / 200);

//     const createBlog = await Blog.create({
//       title,
//       slug,
//       description,
//       category,
//       link: parsedLink,
//       thumbnail: uploadedThumbnailUrl, // Store the uploaded URL or keep it empty
//       readTime: generateReadTime > 0 ? `${generateReadTime} min read` : "Less than a minute",
//     });

//     res.status(201).json({ success: true, message: "Blog created successfully.", data: createBlog });
//   } catch (error) {
//     console.error("Error creating blog:", error);
//     res.status(500).json({ success: false, message: "An unexpected error occurred." });
//   }
// };

// export default addBlog;



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
    let slug = baseSlug;
    let count = 1;
    while (await Blog.findOne({ slug })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    // Calculate read time (1 min for every 200 words)
    const wordCount = description.split(/\s+/).length;
    const generateReadTime = Math.max(1, Math.ceil(wordCount / 200));

    // Create new blog entry
    const newBlog = await Blog.create({
      title,
      slug,
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
