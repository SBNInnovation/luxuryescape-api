import express, { Request, Response, urlencoded } from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url"; // Import for fixing __dirname issue
dotenv.config()

// Fix __dirname issue for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import addTourRouter from "./routes/tours.routes/addtours.routes.js";
import signupRouter from "./routes/login&signup/signupRouter.js";
import loginRouter from "./routes/login&signup/loginRoutes.js";
import cookieParser from "cookie-parser";
import otpRouter from "./routes/otp/otpRoutes.js";
import getActivateTourRouter from "./routes/tours.routes/getActivateTours.routes.js";
import getAllTourRouter from "./routes/tours.routes/getAllTours.routes.js";
import activeteTourRouter from "./routes/tours.routes/activateTours.routes.js";
import getRecommendTourRouter from "./routes/tours.routes/getRecommendTours.routes.js";
import recommendTourRouter from "./routes/tours.routes/recommendTours.routes.js";
import dbConnection from "./connectDB.js";
import getSpecifictourRouter from "./routes/tours.routes/getSpecifictour.routes.js";
import cors from "cors"
import addAccommodationRouter from "./routes/accommodation.routes/addAccommodation.routes.js";
import addTourTypesRouter from "./routes/tourTypes.routes/addTourTypes.routes.js";
import getAllTourTypesRouter from "./routes/tourTypes.routes/getAllTourTypes.route.js";
import getAllAccommodationRouter from "./routes/accommodation.routes/getAllAccommodation.routes.js";
import addBlogRouter from "./routes/blog.routes/addBlog.routes.js";
import getAllBlogRouter from "./routes/blog.routes/getAllBlog.routes.js";
import editTourTypesRouter from "./routes/tourTypes.routes/editTourTypes.route.js";
import deleteTourTypeRouter from "./routes/tourTypes.routes/deleteTourTypes.routes.js";
import getSpecificBlogRouter from "./routes/blog.routes/getSpecificBlog.routes.js";
import editBlogRouter from "./routes/blog.routes/editBlog.routes.js";
import deleteBlogRouter from "./routes/blog.routes/deleteBlog.routes.js";
import getSpecificAccommodationRouter from "./routes/accommodation.routes/getSpecificAccommodation.routes.js";
import updateBlogStatusRouter from "./routes/blog.routes/updateStatus.routes.js";
import addRoomRouter from "./routes/room.routes/addRoom.routes.js";
import getAllRoomRouter from "./routes/room.routes/getAllRoom.routes.js";
import getAllAccommodationWithRoomRouter from "./routes/accommodation.routes/getAllAccommodationWithRoom.routes.js";
import getSpecificAccommodationWithRoomRouter from "./routes/accommodation.routes/getSpecificAccommodationWithRoom.routes.js";

const app = express();


// Connect to database
dbConnection();

const port = process.env.PORT || 4000;  // Use PORT from .env or default to 4000

app.use(express.json());
app.use(urlencoded({extended:true}))
app.use(cookieParser())

// Middleware to serve static files (make uploaded images accessible)
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));
// app.use(cors({
//     origin: ["http://localhost:3000","https://luxuryescape-admin.vercel.app"],
//     methods: ["GET", "POST", "PUT","PATCH", "DELETE"],
// }))

app.use(
    cors({
      origin: ["http://localhost:3000", "https://luxuryescape-admin.vercel.app", "https://luxuryescape-frontend.vercel.app"],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true, // Allow cookies
    })
  );
  

app.use(
    signupRouter,
    loginRouter,
    otpRouter,

    //for tours
    addTourRouter,
    getAllTourRouter,
    activeteTourRouter,
    recommendTourRouter,
    getActivateTourRouter,
    getRecommendTourRouter,
    getSpecifictourRouter,

    //for tourtypes
    addTourTypesRouter,
    getAllTourTypesRouter,
    editTourTypesRouter,
    deleteTourTypeRouter,

    // for accommodation
    addAccommodationRouter,
    getAllAccommodationRouter,
    getSpecificAccommodationRouter,
    getAllAccommodationWithRoomRouter,
    getSpecificAccommodationWithRoomRouter,

    //for blogs
    addBlogRouter,
    getAllBlogRouter,
    getSpecificBlogRouter,
    editBlogRouter,
    deleteBlogRouter,
    updateBlogStatusRouter,

    //for Rooms,
    addRoomRouter,
    getAllRoomRouter
)



app.get("/", (req: Request, res: Response) => {
    res.send("Hello World");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
