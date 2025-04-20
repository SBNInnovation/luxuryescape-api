// import { Request, Response } from "express";
// import Blog from "../../models/blogs.models/blogs.js";

// const blogDelete = async(req:Request,res:Response):Promise<void> =>{
//     try {
//         const blogId = req.params.blogId;
//         if(!blogId){
//             res.status(400).json({message:"Blog id is required"});
//             return;
//         }
//         const blog = await Blog.findByIdAndDelete(blogId);
//         if(!blog){
//             res.status(404).json({message:"Blog not found"});
//             return;
//         }
//         res.status(200).json({success:true,message:"Blog deleted successfully"});
//     } catch (error) {
//         console.log(error);
//         if(error instanceof(Error)){
//             res.status(500).json({success:false, message:error.message});
//             return
//         }
//     }
// }

// export default blogDelete;


import { Request, Response } from "express";
import Blog from "../../models/blogs.models/blogs.js";
import { deleteFile } from "../../utility/cloudinary.js";


const blogDelete = async (req: Request, res: Response): Promise<void> => {
    try {
        const blogId = req.params.blogId;
        if (!blogId) {
            res.status(400).json({ success: false, message: "Blog ID is required." });
            return;
        }

        // Find the blog
        const blog = await Blog.findById(blogId);
        if (!blog) {
            res.status(404).json({ success: false, message: "Blog not found." });
            return;
        }

        // Extract and delete the thumbnail from Cloudinary
        // if (blog.thumbnail) {
        //     const thumbnailPublicId = blog.thumbnail.split('/').pop()?.split('.')[0]; // Extract public ID from URL
        //     if (thumbnailPublicId) {
        //         const deleteResult = await deleteFile(thumbnailPublicId);
        //         if (!deleteResult) {
        //             res.status(500).json({ success: false, message: "Failed to delete thumbnail from Cloudinary." });
        //             return;
        //         }
        //     }
        // }

               if (blog.thumbnail) {
                    const fileName = blog.thumbnail.split('/').pop();         // abc123.jpg
                    const publicId = fileName?.split('.')[0];                 // abc123
                    const fullPublicId = `blogs/thumbnail/${publicId}`;       // ✅ with folder
                    if (fullPublicId) {
                      const deleteResult = await deleteFile(fullPublicId);
                      if (!deleteResult) {
                        res.status(500).json({ sueccess: false, message: "Failed to delete thumbnail image from Cloudinary" });
                        return;
                      }
                    }
                  }

        // Delete the blog from the database
        await Blog.findByIdAndDelete(blogId);
        
        res.status(200).json({ success: true, message: "Blog deleted successfully." });
    } catch (error) {
        console.error("Error deleting blog:", error);
        res.status(500).json({ success: false, message: "An unexpected error occurred." });
    }
};

export default blogDelete;
