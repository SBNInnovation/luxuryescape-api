import express, { Request, Response } from "express"; 
import multer from "multer"; // To handle file uploads
import { createDestination, deleteDestination, getAllDestinations, getDestinationById, MulterRequest, updateDestination } from "../../controllers/destination/destination.controller.js";
import path from "path";
import fs from "fs";
// Initialize Multer for handling image uploads

const destinationRouter = express.Router();

// Define the upload path directly using process.cwd()
const uploadPath = path.resolve(process.cwd(), "public/uploads/destination");

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

// Define file upload fields
const upload = [
  { name: "image", maxCount: 1 }, // Single file for thumbnail
];


// Define the route to handle blog upload
destinationRouter.post(
  "/destination/add", 
  uploader.fields(upload), // Single file upload with field name 'thumbnail'
  (req: Request, res: Response) => {
    console.log("Uploaded file: add", req.file); // Debugging the uploaded file
    createDestination(req as MulterRequest, res); // Ensure MulterRequest type is used
  }
);
// Route for getting a destination by its ID
destinationRouter.get("/destination/get/:destinationId", getDestinationById);

// Route for updating an existing destination by its ID
destinationRouter.put(
  "/destination/edit/:destinationId", 
  uploader.fields(upload), 
  (req: Request, res: Response) => {
    console.log("Uploaded file: edit", req.file); // Debugging the uploaded file
    updateDestination(req as MulterRequest, res); // Ensure MulterRequest type is used
  }
);

// Route for deleting a destination by its ID
destinationRouter.delete("/destination/delete/:destinationId", deleteDestination);

// Route to get all destinations
destinationRouter.get("/destinations", getAllDestinations);

export default destinationRouter;
