import express, { Request, Response } from "express"; 
import multer from "multer"; // To handle file uploads
import { createDestination, deleteDestination, getAllDestinations, getDestinationById, MulterRequest, updateDestination } from "../../controllers/destination/destination.controller.js";

// Initialize Multer for handling image uploads
const upload = multer({ dest: "uploads/" });

const destinationRouter = express.Router();

// Route for creating a new destination
destinationRouter.post("/destination/add", upload.single("image"), async (req: Request, res: Response) => {
  // Type the `req` to have the `files` property properly handled
  const multerReq = req as MulterRequest; 
  await createDestination(multerReq, res);
});

// Route for getting a destination by its ID
destinationRouter.get("/destination/get/:destinationId", getDestinationById);

// Route for updating an existing destination by its ID
destinationRouter.put("/destination/edit/:destinationId", upload.single("image"), async (req: Request, res: Response) => {
  const multerReq = req as MulterRequest; 
  await updateDestination(multerReq, res);
});

// Route for deleting a destination by its ID
destinationRouter.delete("/destinations/delete/:destinationId", deleteDestination);

// Route to get all destinations
destinationRouter.get("/destinations", getAllDestinations);

export default destinationRouter;
