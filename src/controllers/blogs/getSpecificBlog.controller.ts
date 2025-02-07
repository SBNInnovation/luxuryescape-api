import { Request, Response } from "express";
import Blog from "../../models/blogs.models/blogs.js";

const getSpecificBlog = async(req:Request,res:Response):Promise<void> =>{
    try {
        const slug = req.params.slug;

        if(!slug){
            res.status(404).json({success:false, message:"Slug is required"});
            return
        }
        const blog = await Blog.findOne({slug:slug}).populate("category","tourType");
        if(!blog){
            res.status(404).json({success:false, message:"Blog not found"});
            return
        }
        res.status(200).json({success:true, message:"single blog fetched successfully",data:blog});
        
    } catch (error) {
        console.log(error);
        if(error instanceof Error){
            res.status(500).json({success:false, message:error.message});
            return
        }
    }
}

export default getSpecificBlog;