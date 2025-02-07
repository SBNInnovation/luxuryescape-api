import { Request, Response } from "express";
import Blog from "../../models/blogs.models/blogs.js";

const blogDelete = async(req:Request,res:Response):Promise<void> =>{
    try {
        const blogId = req.params.blogId;
        if(!blogId){
            res.status(400).json({message:"Blog id is required"});
            return;
        }
        const blog = await Blog.findByIdAndDelete(blogId);
        if(!blog){
            res.status(404).json({message:"Blog not found"});
            return;
        }
        res.status(200).json({success:true,message:"Blog deleted successfully"});
    } catch (error) {
        console.log(error);
        if(error instanceof(Error)){
            res.status(500).json({success:false, message:error.message});
            return
        }
    }
}

export default blogDelete;