// import express, { response } from "express";
// import multer from "multer";
// import { Request, Response } from "express";
// import fs from "fs";
// import path from "path";
// import addRoom, { MulterRequest } from "../../controllers/rooms/addRoom.controller.js";

// const addRoomRouter = express.Router();

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
//   { name: "roomPhotos", maxCount: 5 },
// ];


// addRoomRouter.post(
//   "/room/add-room",
//   uploader.fields(upload),
//   (req, res) => {
//     console.log("Uploaded files:", req.files); // Debugging
//     addRoom(req as MulterRequest, res); // Explicit type assertion
//   }
// );

// export default addRoomRouter;




import express, { Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import addRoom, { MulterRequest } from "../../controllers/rooms/addRoom.controller.js";
import editRoom from "../../controllers/rooms/editRoom.controller.js";


const addRoomRouter = express.Router();
const editRoomRouter = express.Router();

// Define the absolute upload path using process.cwd()
const uploadPath = path.resolve(process.cwd(), "public/uploads/rooms");

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
  { name: "roomPhotos", maxCount: 5 }, // Field for multiple photos
];

// Define the route to handle room upload
addRoomRouter.post(
  "/room/add-room", 
  uploader.fields(upload), // Handle multiple files with the "roomPhotos" field
  (req: Request, res: Response) => {
    console.log("Uploaded files:", req.files); // Debugging the uploaded files
    addRoom(req as MulterRequest, res); // Ensure MulterRequest type is used
  }
);

editRoomRouter.patch(
  "/room/edit/:roomId", 
  uploader.fields(upload), // Handle multiple files with the "roomPhotos" field
  (req: Request, res: Response) => {
    console.log("Uploaded files:", req.files); // Debugging the uploaded files
    editRoom(req as MulterRequest, res); // Ensure MulterRequest type is used
  }
);

export {addRoomRouter,editRoomRouter};
