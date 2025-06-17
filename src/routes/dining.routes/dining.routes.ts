import express, { Request, Response } from "express"; 
import multer from "multer";
import fs from "fs";
import path from "path";
import addFineDining, { MulterRequest } from "../../controllers/fine-dining/add.controller.js";
import editFineDining from "../../controllers/fine-dining/edit.controller.js";
import deleteFineDining from "../../controllers/fine-dining/delete.controller.js";
import makeFeaturedFineDining from "../../controllers/fine-dining/addFeatured.controller.js";
import getSelectedDiningData from "../../controllers/fine-dining/getAll.controller.js";
import getSpecificFineDining from "../../controllers/fine-dining/getSpecific.controller.js";




// Setup router
const fineDiningRouter = express.Router();

// Define the upload directory path
const uploadPath = path.resolve("public/uploads/finedining");

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
  { name: "pics", maxCount: 5 },
  {name: "logo", maxCount:1}
];

// Define the route for adding accommodations
fineDiningRouter.post(
  "/finedining/add",
  uploader.fields(upload),
  (req: Request, res: Response) => {
    console.log("Uploaded files:", req.files); // Debugging

    // Call the accommodation controller function
    addFineDining(req as MulterRequest, res);
  }
);

// Route to edit existing accommodation
fineDiningRouter.put(
  "/finedining/edit/:fineDiningId",
  uploader.fields(upload),
  (req: Request, res: Response) => {
    console.log("Uploaded files for edit:", req.files); // Debugging
    editFineDining(req as MulterRequest, res);
  }
);

fineDiningRouter.route("/finedining/delete/:fineDiningId").delete(deleteFineDining)

fineDiningRouter.route("/finedining/update/:fineDiningId").patch(makeFeaturedFineDining)

//get all
fineDiningRouter.route("/finedining/get-all-details").get(getSelectedDiningData)

//get specific
fineDiningRouter.route("/finedining/get/:slug").get(getSpecificFineDining)

export default fineDiningRouter

