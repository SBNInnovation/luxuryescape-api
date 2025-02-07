import { Request, Response } from "express"
import Blog from "../../models/blogs.models/blogs.js";
import { uploadFile } from "../../utility/cloudinary.js";

const editBlog = async(req:Request,res:Response):Promise<void> =>{
    try {
        const slug = req.params.slug;
        const { title, description, category, link } = req.body;

        if (!title || !description || !category) {
            res.status(400).json({ success: false, message: "Please fill all required fields." });
            return;
          }
      

        if(!slug){
            res.status(404).json({success:false, message:"Blog not found"})
            return
        }

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

        let uploadedThumbnailUrl = ""; // Default empty string if no image is uploaded
        if (req.file) {
        // const uploadedThumbnail = await uploadFile(req.file.path, "blogs/thumbnail");
        const uploadedThumbnail = await uploadFile(`${req.file.path}`, "blogs/thumbnail");  //Multer stores files locally (public/uploads/blogs), but Cloudinary needs an absolute path.
        if (uploadedThumbnail?.secure_url) {
            uploadedThumbnailUrl = uploadedThumbnail.secure_url;
        }
        }
        const wordCount = description.split(" ").length;
        const generateReadTime = Math.floor(wordCount / 200);

        const edit = await Blog.findOneAndUpdate({
            slug:slug,
        },{
            $set:{
                title,
                slug,
                description,
                category,
                link: parsedLink,
                thumbnail: uploadedThumbnailUrl, // Store the uploaded URL or keep it empty
                readTime: generateReadTime > 0 ? `${generateReadTime} min read` : "Less than a minute",
            }
        },{
            new:true
        })
        if(!edit){
            res.status(404).json({success:false, message:"Blog not found"})
            return
        }
        res.status(200).json({success:true, message:"Blog updated successfully",data:edit})
    } catch (error) {
        console.log(error)
        if(error instanceof Error){
            res.status(500).json({success:false, message:error.message})
        }
    }
}

export default editBlog;