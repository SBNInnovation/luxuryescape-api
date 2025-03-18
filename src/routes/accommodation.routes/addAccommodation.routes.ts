// import express from "express";
// import multer from "multer";
// import addAccomodation from "../../controllers/accommodations/addAccommodation.controller.js";
// const addAccommodationRouter = express.Router();
// import { MulterRequest } from "../../controllers/accommodations/addAccommodation.controller.js";
// import { Request, Response } from "express";

// // interface MulterRequest extends Request {
// //   files?: {
// //     accommodationPics?: Express.Multer.File[];
// //     roomPhotos?: Express.Multer.File[];
// //   };
// // }

// const uploader = multer({
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, "src/uploads/accommodation");
//     },
//     filename: (req, file, cb) => {
//       cb(null, `${Date.now()}-${file.originalname}`);
//     },
//   }),
// });

// // const upload = [
// //   { name: "accommodationPics", maxCount: 5 },
// //   { name: "roomPhotos", maxCount: 5 },
// // ];

// // addAccommodationRouter.post(
// //   "/accommodation/add-accomodation",
// //   uploader.fields(upload),
// //   (req, res) => {
// //     addAccomodation(req as MulterRequest, res); 
// //   }
// // );

// const upload = [
//   { name: "accommodationPics", maxCount: 5 },
//   { name: "roomPhotos", maxCount: 5 },
// ];

// addAccommodationRouter.post(
//   "/accommodation/add-accommodation",
//   uploader.fields(upload),
//   (req, res) => {
//     console.log(req.files); // Debug to see what is received
//     addAccomodation(req as MulterRequest, res);// Explicit type assertion
//   }
// );


// export default addAccommodationRouter;


// import express from "express";
// import multer from "multer";
// import addAccomodation from "../../controllers/accommodations/addAccommodation.controller.js";
// import { MulterRequest } from "../../controllers/accommodations/addAccommodation.controller.js";
// import { Request, Response } from "express";
// import fs from "fs";
// import path from "path";

// const addAccommodationRouter = express.Router();

// // Get __dirname equivalent in ES module scope
// const __filename = new URL(import.meta.url).pathname;
// const __dirname = path.dirname(__filename);

// // Define the absolute upload path
// const uploadPath = path.resolve(process.cwd(), "public/uploads/accommodation");

// // Log the resolved upload path for debugging
// console.log("Resolved Upload Path:", uploadPath);

// // Ensure the directory exists
// if (!fs.existsSync(uploadPath)) {
//   console.log("Creating directory:", uploadPath);
//   fs.mkdirSync(uploadPath, { recursive: true });
// }

// // Multer setup
// const uploader = multer({
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, uploadPath); // Use absolute resolved path
//     },
//     filename: (req, file, cb) => {
//       cb(null, `${Date.now()}-${file.originalname}`);
//     },
//   }),
// });

// // Define file upload fields
// const upload = [
//   { name: "accommodationPics", maxCount: 5 },
//   { name: "roomPhotos", maxCount: 5 },
// ];

// // Define the route for adding accommodations
// addAccommodationRouter.post(
//   "/accommodation/add-accommodation",
//   uploader.fields(upload),
//   (req, res) => {
//     console.log("Uploaded files:", req.files); // Debugging
//     addAccomodation(req as MulterRequest, res); // Explicit type assertion
//   }
// );

// export default addAccommodationRouter;

// import express, { response } from "express";
// import multer from "multer";
// import addAccomodation from "../../controllers/accommodations/addAccommodation.controller.js";
// import { MulterRequest } from "../../controllers/accommodations/addAccommodation.controller.js";
// import { Request, Response } from "express";
// import fs from "fs";
// import path from "path";

// const addAccommodationRouter = express.Router();

// // Get __dirname equivalent in ES module scope
// const __filename = new URL(import.meta.url).pathname;
// const __dirname = path.dirname(__filename);

// // Define the absolute upload path
// const uploadPath = path.resolve("public/uploads/accommodation");

// // Log the resolved upload path for debugging
// console.log("Resolved Upload Path:", uploadPath);

// // Ensure the directory exists
// if (!fs.existsSync(uploadPath)) {
//   console.log("Creating directory:", uploadPath);
//   fs.mkdirSync(uploadPath, { recursive: true });
// }

// // Multer setup
// const uploader = multer({
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, uploadPath); // Use absolute resolved path
//     },
//     filename: (req, file, cb) => {
//       cb(null, `${Date.now()}-${file.originalname}`);
//     },
//   }),
// });

// // Define file upload fields
// const upload = [
//   { name: "accommodationPics", maxCount: 5 }
// ];

// // Define the route for adding accommodations
// addAccommodationRouter.post(
//   "/accommodation/add-accommodation",
//   uploader.fields(upload),
//   (req, res) => {
//     console.log("Uploaded files:", req.files); // Debugging
//     addAccomodation(req as MulterRequest, res); // Explicit type assertion
//   }
// );

// export default addAccommodationRouter;

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

