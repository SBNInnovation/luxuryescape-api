import { Request, Response } from "express";
import Blog from "../../models/blogs.models/blogs.js";

const getAllBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    // Parse pagination parameters
    const page: number = parseInt(req.query.page as string, 10) || 1;
    const limit: number = parseInt(req.query.limit as string, 10) || 10;
    const search = (req.query.search as string || "").toLowerCase().trim();
    const filter = (req.query.filter as string || "").toLowerCase().trim();
    const sort = (req.query.sort as string || "").toLowerCase().trim();

    if (page < 1 || limit < 1) {
      res.status(400).json({ success: false, message: "Invalid page or limit." });
      return;
    }

    const skip = (page - 1) * limit;

    // Combine search and filter queries
    let query: any = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }
    if (filter) {
      query.category = { $regex: filter, $options: "i" };
    }

    // Sorting logic (default: newest first)
    let sortQuery: any = { createdAt: -1 };
    if (sort === "asc") {
      sortQuery = { createdAt: 1 };
    } else if (sort === "desc") {
      sortQuery = { createdAt: -1 };
    }

    // Fetch blogs with pagination & sorting
    const blogs = await Blog.find(query)
        .populate("category", "tourType")
        .skip(skip)
        .limit(limit)
        .sort(sortQuery);


    // Fetch total count for pagination metadata
    const total = await Blog.countDocuments(query);

    if (blogs.length === 0) {
      res.status(404).json({ success: false, message: "No blogs found." });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Blogs fetched successfully.",
      data: {
        blogs,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export default getAllBlogs;
