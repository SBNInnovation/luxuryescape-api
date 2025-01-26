import express from "express";
import multer from "multer";
import addAccomodation from "../../controllers/accommodations/addAccommodation.controller.js";
const addAccommodationRouter = express.Router();
import { MulterRequest } from "../../controllers/accommodations/addAccommodation.controller.js";
import { Request, Response } from "express";

// interface MulterRequest extends Request {
//   files?: {
//     accommodationPics?: Express.Multer.File[];
//     roomPhotos?: Express.Multer.File[];
//   };
// }

const uploader = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "src/uploads/accommodation");
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

// const upload = [
//   { name: "accommodationPics", maxCount: 5 },
//   { name: "roomPhotos", maxCount: 5 },
// ];

// addAccommodationRouter.post(
//   "/accommodation/add-accomodation",
//   uploader.fields(upload),
//   (req, res) => {
//     addAccomodation(req as MulterRequest, res); 
//   }
// );

const upload = [
  { name: "accommodationPics", maxCount: 5 },
  { name: "roomPhotos", maxCount: 5 },
];

addAccommodationRouter.post(
  "/accommodation/add-accommodation",
  uploader.fields(upload),
  (req, res) => {
    console.log(req.files); // Debug to see what is received
    addAccomodation(req as MulterRequest, res);// Explicit type assertion
  }
);


export default addAccommodationRouter;
