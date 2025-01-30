import express from "express";
import path from "path"
import multer from "multer";
import addBlog from "../../controllers/blogs/addBlog.controller.js";
import { MulterRequest } from "../../controllers/tourTypes/addTourTypes.controller.js"; // Make sure this is the correct path
const addBlogRouter = express.Router();


// Multer setup for single file upload
// const uploader = multer({
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, "src/uploads/blogs"); // Adjust the folder name here as needed
//     },
//     filename: (req, file, cb) => {
//       cb(null, `${Date.now()}-${file.originalname}`);
//     },
//   }),
// });

const uploader = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../uploads/blogs")); // Matches your static folder
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});


// POST route for adding a blog
addBlogRouter.post(
  "/blog/add-blog",
  uploader.single("thumbnail"), // Correct method for handling single file upload
  (req, res) => {
    console.log(req.file); // Debug to see what is received
    addBlog(req as MulterRequest, res); // Explicit type assertion for MulterRequest
  }
);

export default addBlogRouter;


