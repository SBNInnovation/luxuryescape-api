// // routes/blogs/addBlog.routes.js
// import express from "express";
// import multer from "multer";
// import addBlog, { MulterRequest } from "../../controllers/blogs/addBlog.controller.js";

// const addBlogRouter = express.Router();

// import path from "path";
// import fs from "fs";

// const __filename = new URL(import.meta.url).pathname;
// const __dirname = path.dirname(__filename);

// const uploadPath = path.resolve(process.cwd(),"public/uploads/blogs");

// if(!fs.existsSync(uploadPath)){
//   console.log("creating directory", uploadPath);
//   fs.mkdirSync(uploadPath, {recursive:true});
// }

// const uploader = multer({
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, uploadPath);
//     },
//     filename: (req, file, cb) => {
//       cb(null, `${Date.now()}-${file.originalname}`);
//     },
//   }),
// });

// addBlogRouter.post("/blog/add-blog", uploader.single("thumbnail"), (req, res) => {
//   console.log(req.file);
//   addBlog(req as MulterRequest, res);
// });

// export default addBlogRouter;




import express, { Request, Response } from "express";
import multer from "multer";
import addBlog, { MulterRequest } from "../../controllers/blogs/addBlog.controller.js"; // Ensure MulterRequest is exported correctly
import path from "path";
import fs from "fs";

// Initialize router
const addBlogRouter = express.Router();

// Define the upload path directly using process.cwd()
const uploadPath = path.resolve(process.cwd(), "public/uploads/blogs");

// Ensure the directory exists
if (!fs.existsSync(uploadPath)) {
  console.log("Creating directory:", uploadPath);
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer setup for file upload
const uploader = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath); // Set destination to the upload path
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`); // Name files with a timestamp
    },
  }),
});

// Define the route to handle blog upload
addBlogRouter.post(
  "/blog/add-blog", 
  uploader.single("thumbnail"), // Single file upload with field name 'thumbnail'
  (req: Request, res: Response) => {
    console.log("Uploaded file:", req.file); // Debugging the uploaded file
    addBlog(req as MulterRequest, res); // Ensure MulterRequest type is used
  }
);

export default addBlogRouter;
