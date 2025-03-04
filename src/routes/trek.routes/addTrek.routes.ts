// import express from "express";
// import multer from "multer";
// import { Request } from "express";
// import { Express } from "express";
// import fs from "fs";
// import path from "path";
// import addTrek, { MulterRequest } from "../../controllers/treks/addTrek.controller.js";

// const addTrekRouter = express.Router();

// const __filename = new URL(import.meta.url).pathname;
// const __dirname = path.dirname(__filename);

// const uploadPath = path.resolve(process.cwd(), "public/uploads/treks");

// console.log("Resolved Upload Path:", uploadPath);

// if (!fs.existsSync(uploadPath)) {
//   console.log("Creating directory:", uploadPath);
//   fs.mkdirSync(uploadPath, { recursive: true });
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

// const upload = [
//   { name: "thumbnail", maxCount: 1 },
//   { name: "gallery", maxCount: 5 },
//   { name: "highlightPicture", maxCount: 10 },
//   { name: "itineraryDayPhoto" },
// ];

// addTrekRouter.post("/trek/add-trek", uploader.fields(upload), (req, res) => {
//   addTrek(req as MulterRequest, res);
// });

// export default addTrekRouter;



import express from "express";
import multer from "multer";
import { Request } from "express";
import { Express } from "express";
import fs from "fs";
import path from "path";
import addTrek, { MulterRequest } from "../../controllers/treks/addTrek.controller.js";

const addTrekRouter = express.Router();

// Define the absolute upload path using process.cwd() to get the project root
const uploadPath = path.resolve(process.cwd(), "public/uploads/treks");

// Log the resolved upload path for debugging
console.log("Resolved Upload Path:", uploadPath);

// Ensure the directory exists before uploading
if (!fs.existsSync(uploadPath)) {
  console.log("Creating directory:", uploadPath);
  fs.mkdirSync(uploadPath, { recursive: true }); // Create the directory with necessary parent directories
}

// Multer setup for file upload
const uploader = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath); // Use the resolved absolute path for file storage
    },
    filename: (req, file, cb) => {
      // Set file name as a timestamp with the original file name
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

// Define the fields for file upload with their limits
const upload = [
  { name: "thumbnail", maxCount: 1 },
  { name: "gallery", maxCount: 5 },
  { name: "highlightPicture", maxCount: 10 },
  { name: "itineraryDayPhoto" },
];

// Route to handle trek addition with file uploads
addTrekRouter.post("/trek/add-trek", uploader.fields(upload), (req, res) => {
  addTrek(req as MulterRequest, res); // Explicit type assertion for the request
});

export default addTrekRouter;
