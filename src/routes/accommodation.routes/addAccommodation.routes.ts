import express, { Request, Response } from "express"; 
import multer from "multer";
import fs from "fs";
import path from "path";
import addAccommodation, { MulterRequest } from "../../controllers/accommodations/addAccommodation.controller.js";
import editAccommodation from "../../controllers/accommodations/editAccommodation.controller.js";



// Setup router
const addAccommodationRouter = express.Router();
const editAccommodationRouter = express.Router();

// Define the upload directory path
const uploadPath = path.resolve("public/uploads/accommodation");

// Ensure the directory exists
if (!fs.existsSync(uploadPath)) {
  console.log("Creating directory:", uploadPath);
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer setup
const uploader = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath); // Set destination to the correct directory
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

// Define file upload fields
const upload = [
  { name: "accommodationPics", maxCount: 5 }
];

// Define the route for adding accommodations
addAccommodationRouter.post(
  "/accommodation/add-accommodation",
  uploader.fields(upload),
  (req: Request, res: Response) => {
    console.log("Uploaded files:", req.files); // Debugging

    // Call the accommodation controller function
    addAccommodation(req as MulterRequest, res);
  }
);

// Route to edit existing accommodation
editAccommodationRouter.put(
  "/accommodation/edit/:accommodationId",
  uploader.fields(upload),
  (req: Request, res: Response) => {
    console.log("Uploaded files for edit:", req.files); // Debugging
    editAccommodation(req as MulterRequest, res);
  }
);

export {addAccommodationRouter,editAccommodationRouter};

