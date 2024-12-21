import express from "express";
import multer from "multer";
import addTour from "../../controllers/tours.controllers/addtours.controllers";
import { Request } from "express";
import { Express } from "express";

const addTourRouter = express.Router();

interface MulterRequest extends Request {
    files: {
      thumbnail?: Express.Multer.File[],
      destinationPhoto?: Express.Multer.File[],
      highlightPicture?: Express.Multer.File[],
      itineraryDayPhoto?: Express.Multer.File[],
      accommodationPics?: Express.Multer.File[]
    }
  }


  const uploader = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "src/uploads");
      },
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
      },
    }),
  });

const upload = [
  { name: "thumbnail", maxCount: 1 }, 
  { name: "destinationPhoto", maxCount: 1 },
  { name: "highlightPicture", maxCount: 1 },
  { name: "itineraryDayPhoto", maxCount: 1 },
  { name: "accommodationPics", maxCount: 5 },
];

addTourRouter.post("/add-tours",uploader.fields(upload),(req,res)=>{
    addTour(req as MulterRequest,res)
})

// addTourRouter.post("/add-tours",addTour)

export default addTourRouter;


