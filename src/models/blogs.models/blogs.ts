import { Schema } from "mongoose";
import mongoose from "mongoose";

const blogSchema = new Schema({
    blogTitle:{type:String, required:true},
    
})