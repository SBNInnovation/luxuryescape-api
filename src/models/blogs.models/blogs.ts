// models/blogs.js
import { Schema } from "mongoose";
import mongoose from "mongoose";

const linkSchema = new Schema({
    key: { type: String },
    url: { type: String },
}, { _id: false });

const blogSchema = new Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    thumbnail: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "TourTypes" },
    description: { type: String, required: true},
    link: [linkSchema],
    isActive: { type: Boolean, default: true },
    isFeature:{type:Boolean, default:false},
    readTime: { type: String, default: "" }
}, { timestamps: true });

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;