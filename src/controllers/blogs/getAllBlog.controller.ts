import { Request, Response } from "express"
import Blog from "../../models/blogs.models/blogs.js";

const getAllBlogs = async(req:Request, res:Response):Promise<void> => {
    try {
         // Parse pagination parameters
    const page: number = parseInt(req.query.page as string, 10) || 1;
    const limit: number = parseInt(req.query.limit as string, 10) || 10;
    const search = req.query.search as string || ""?.toLowerCase().trim(); 

    if(page < 1 || limit <10){
         res.status(404).json({success:false,message:"Invalid page or limit"})
         return
    }

    const skip = (page-1)*limit;

    const query = search
    ? {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
        ],
      }
    : {};

    const getAll = await Blog.find(query).skip(skip).limit(limit).sort({createdAt: -1})
    if(!getAll){
         res.status(404).json({success:false,message:"No blogs found"})
         return
    }

     // Fetch total count of matching documents (for pagination metadata)
    const total = await Blog.countDocuments(query);

    // Check if blog exist
    if (!getAll.length) {
      res.status(404).json({ success: false, message: "No blogs found." });
      return
    }

    res.status(200).json({
      success: true,
      message: "blogs fetched successfully.",
      data: {
        getAll,
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
}

export default getAllBlogs