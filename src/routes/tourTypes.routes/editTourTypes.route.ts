import express from "express";
import multer from "multer";
// import fs from "fs";
// import path from "path";
import editTourTypes, { MulterRequest } from "../../controllers/tourTypes/editTourTypes.controller.js";

const editTourTypesRouter = express.Router();

// const __filename = new URL(import.meta.url).pathname;  //This gets the full path to the current file (the one where this code is written).
// const __dirname = path.dirname(__filename);  //This extracts the directory name from the full path, allowing you to work with file paths relative to this file's location.

// Ensure you're getting an absolute path from the root of the project
// path.resolve This ensures that the uploadPath is an absolute path based on the root of the current working directory (the project root). 
// This resolves public/uploads/tourTypes to an absolute path, which will be used to store uploaded files.
// const uploadPath = path.resolve(process.cwd(), "public/uploads/tourTypes"); // Absolute path
// process.cwd(): This returns the current working directory (usually the root of your project when you run the server).

// Log the resolved upload path
// console.log("Resolved Upload Path:", uploadPath);

// // Ensure the directory exists before uploading
// if (!fs.existsSync(uploadPath)) {  //fs.existsSync(uploadPath): This checks if the uploadPath already exists on the file system.
//   console.log("Creating directory:", uploadPath);
//   fs.mkdirSync(uploadPath, { recursive: true }); //fs.mkdirSync(uploadPath, { recursive: true }): 
//                                                  //If the directory doesn't exist, it creates it, including any parent directories (thanks to { recursive: true }).
// }

const uploader = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, file.destination); // Use the resolved absolute path
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

editTourTypesRouter.patch("/tour/edit-tour-type/:tourTypeId", uploader.single("thumbnail"), (req, res) => {
  editTourTypes(req as MulterRequest, res);
});

export default editTourTypesRouter;



