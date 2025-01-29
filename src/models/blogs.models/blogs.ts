import { Schema } from "mongoose";
import mongoose from "mongoose";

const blogSchema = new Schema({
    blogTitle:{type:String, required:true},
    thumbnail:{type:String},
    blogPhotos:{type:[String],default:[]},
    category:{type:mongoose.Schema.Types.ObjectId,ref:"TourTypes"},
    blogDescription:{type:String,required:true},
    isFeatured:{type:Boolean, default:false},
},{
    timestamps:true
})

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;