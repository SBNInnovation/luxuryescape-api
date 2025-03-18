// import express from "express";
// import multer from "multer";
// import addTour, { MulterRequest } from "../../controllers/tours/addtours.controllers.js";
// import { Request } from "express";
// import { Express } from "express";
// import fs from "fs";
// import path from "path";

// const addTourRouter = express.Router();

// // interface MulterRequest extends Request {
// //   files?: {
// //     thumbnail?:Express.Multer.File[];
// //     gallery?: Express.Multer.File[];
// //     destinationPhoto?: Express.Multer.File[];
// //     highlightPicture?: Express.Multer.File[];
// //     itineraryDayPhoto?: Express.Multer.File[];
// //   };
// // }

//   // Get __dirname equivalent in ES module scope
//   const __filename = new URL(import.meta.url).pathname;
//   const __dirname = path.dirname(__filename);
  
//   // Define the absolute upload path
//   const uploadPath = path.resolve(process.cwd(), "public/uploads/tours");
  
//   // Log the resolved upload path for debugging
//   console.log("Resolved Upload Path:", uploadPath);
  
//   // Ensure the directory exists
//   if (!fs.existsSync(uploadPath)) {
//     console.log("Creating directory:", uploadPath);
//     fs.mkdirSync(uploadPath, { recursive: true });
//   }
  
//   // Multer setup
//   const uploader = multer({
//     storage: multer.diskStorage({
//       destination: (req, file, cb) => {
//         cb(null, uploadPath); // Use absolute resolved path
//       },
//       filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);
//       },
//     }),
//   });
  

// const upload = [
//   { name:"thumbnail",maxCount:1},
//   { name: "gallery", maxCount: 5 }, 
//   { name: "highlightPicture", maxCount: 10 },
//   { name: "itineraryDayPhoto"}
// ];




// addTourRouter.post("/tour/add-tour",uploader.fields(upload),(req,res)=>{
//     addTour(req as MulterRequest,res)
// })

// export default addTourRouter;






import express, { Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import addTour, { MulterRequest } from "../../controllers/tours/addtours.controllers.js";
import editTour from "../../controllers/tours/editTours.controller.js";


const addTourRouter = express.Router();
const editTourRouter = express.Router();

// Define the absolute upload path using process.cwd()
const uploadPath = path.resolve(process.cwd(), "public/uploads/tours");

// Log the resolved upload path for debugging
console.log("Resolved Upload Path:", uploadPath);

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
      // Set file name as a timestamp with the original name
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

// Define file upload fields
const upload = [
  { name: "thumbnail", maxCount: 1 }, // Single file for thumbnail
  { name: "gallery", maxCount: 5 },    // Multiple files for gallery (max 5)
  { name: "highlightPicture", maxCount: 10 },  // Multiple files for highlight pictures (max 10)
  { name: "itineraryDayPhoto" } // Multiple files for itinerary photos (no max count)
];

// Define the route to handle tour upload
addTourRouter.post(
  "/tour/add-tour",
  uploader.fields(upload), // Handle multiple fields for uploads
  (req: Request, res: Response) => {
    console.log("Uploaded files:", req.files); // Log the uploaded files for debugging
    addTour(req as MulterRequest, res); // Call your controller function
  }
);

editTourRouter.post(
  "/tour/edit/:tourId",
  uploader.fields(upload), // Handle multiple fields for uploads
  (req: Request, res: Response) => {
    console.log("Uploaded files:", req.files); // Log the uploaded files for debugging
    editTour(req as MulterRequest, res); // Call your controller function
  }
);

export {addTourRouter, editTourRouter};
