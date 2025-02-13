import express from "express";
import multer from "multer";
import addTour, { MulterRequest } from "../../controllers/tours/addtours.controllers.js";
import { Request } from "express";
import { Express } from "express";
import fs from "fs";
import path from "path";

const addTourRouter = express.Router();

// interface MulterRequest extends Request {
//   files?: {
//     thumbnail?:Express.Multer.File[];
//     gallery?: Express.Multer.File[];
//     destinationPhoto?: Express.Multer.File[];
//     highlightPicture?: Express.Multer.File[];
//     itineraryDayPhoto?: Express.Multer.File[];
//   };
// }

  // Get __dirname equivalent in ES module scope
  const __filename = new URL(import.meta.url).pathname;
  const __dirname = path.dirname(__filename);
  
  // Define the absolute upload path
  const uploadPath = path.resolve(process.cwd(), "public/uploads/tours");
  
  // Log the resolved upload path for debugging
  console.log("Resolved Upload Path:", uploadPath);
  
  // Ensure the directory exists
  if (!fs.existsSync(uploadPath)) {
    console.log("Creating directory:", uploadPath);
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  
  // Multer setup
  const uploader = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadPath); // Use absolute resolved path
      },
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
      },
    }),
  });
  

const upload = [
  { name:"thumbnail",maxCount:1},
  { name: "images", maxCount: 5 }, 
  { name: "destinationPhoto", maxCount: 1 },
  { name: "highlightPicture", maxCount: 1 },
  { name: "itineraryDayPhoto", maxCount: 1 },
];




addTourRouter.post("/tour/add-tour",uploader.fields(upload),(req,res)=>{
    addTour(req as MulterRequest,res)
})

export default addTourRouter;


