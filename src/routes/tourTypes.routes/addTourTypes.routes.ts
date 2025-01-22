import express from "express";
import addTourTypes from "../../controllers/tourTypes/addTourTypes.controller.js";
import multer from "multer";
import { MulterRequest } from "../../controllers/tourTypes/addTourTypes.controller.js";
import { Express } from "express";

const addTourTypesRouter = express.Router();

  const uploader = multer({
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, "src/uploads/tourTypes");
        },
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    });

    addTourTypesRouter.post("/tour/add-tour-type", uploader.single("thumbnail"), (req, res) => {
        //console.log("File received:", req.file); // Log file data to confirm upload
        addTourTypes(req as MulterRequest, res);
      });
      

// addTourRouter.post("/tour/add-tour",uploader.fields(upload),(req,res)=>{
//     addTour(req as MulterRequest,res)
// })
export default addTourTypesRouter;

