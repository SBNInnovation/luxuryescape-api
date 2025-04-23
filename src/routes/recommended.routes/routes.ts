import express from "express";
import { addRecommededAcco, deleteReccommended, editReccommendedAcco, getAllRecommended, getRecommendedById, MulterRequest } from "../../controllers/recommendedAcco.controller.ts/recommended.controller.js";
import multer from "multer";
import fs from "fs";
import path from "path";

const recommendedRouter = express.Router();

// Define the absolute upload path using process.cwd() to get the project root
const uploadPath = path.resolve(process.cwd(), "public/uploads/tourTypes");

// Log the resolved upload path for debugging
console.log("Resolved Upload Path:", uploadPath);

// Ensure the directory exists before uploading
if (!fs.existsSync(uploadPath)) {
  console.log("Creating directory:", uploadPath);
  fs.mkdirSync(uploadPath, { recursive: true });
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

recommendedRouter.route("/reccommend/get").get(getAllRecommended)
recommendedRouter.route("/reccommend/get/single").get(getRecommendedById)
recommendedRouter.route("/reccommend/delete").delete(deleteReccommended)
recommendedRouter.post(
    "/recommended/add",
    uploader.single("thumbnail"), // Handle single file upload for 'thumbnail'
    (req, res) => {
      addRecommededAcco(req as MulterRequest, res); // Explicit type assertion for the request
    }
  );
recommendedRouter.patch("recommended/edit",
    uploader.single("thumnail"),
    (req,res) =>{
        editReccommendedAcco(req as MulterRequest, res)
    }
)

export default recommendedRouter;
