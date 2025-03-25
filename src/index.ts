import express, { Request, Response, urlencoded } from "express";
import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url"; // Import for fixing __dirname issue
dotenv.config()

// Fix __dirname issue for ES Modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

import {addTourRouter, editTourRouter} from "./routes/tours.routes/addtours.routes.js";
import signupRouter from "./routes/login&signup/signupRouter.js";
import loginRouter from "./routes/login&signup/loginRoutes.js";
import cookieParser from "cookie-parser";
import otpRouter from "./routes/otp/otpRoutes.js";
import activeteTourRouter from "./routes/tours.routes/activateTours.routes.js";
import dbConnection from "./connectDB.js";
import getSpecifictourRouter from "./routes/tours.routes/getSpecifictour.routes.js";
import cors from "cors"
import {addAccommodationRouter, editAccommodationRouter} from "./routes/accommodation.routes/addAccommodation.routes.js";
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
import {addRoomRouter, editRoomRouter} from "./routes/room.routes/addRoom.routes.js";
import getAllRoomRouter from "./routes/room.routes/getAllRoom.routes.js";
import getAllAccommodationWithRoomRouter from "./routes/accommodation.routes/getAllAccommodationWithRoom.routes.js";
import getSpecificAccommodationWithRoomRouter from "./routes/accommodation.routes/getSpecificAccommodationWithRoom.routes.js";
import addContactRouter from "./routes/contact.routes/addContact.routes.js";
import getSelectedDataRouter from "./routes/tours.routes/getSelectedData.routes.js";
import getSelectedAccommodationDataRouter from "./routes/accommodation.routes/getSelectedAccomodationData.routes.js";
import addQuoteRouter from "./routes/qoute.routes/addQuote.routes.js";
import getAllQuoteRouter from "./routes/qoute.routes/getAllQuote.routes.js";
import getSpecificQuoteRouter from "./routes/qoute.routes/getSpecificQuote.routes.js";
import replyQuoteRouter from "./routes/qoute.routes/replyQuote.routes.js";
import deleteQuoteRouter from "./routes/qoute.routes/deleteQuote.routes.js";
import deleteAllQuoteRouter from "./routes/qoute.routes/deleteAllQuote.routes.js";
import addTailormadeRouter from "./routes/tailor-made.routes/addTailorMade.routes.js";
import getAllTailormadeRouter from "./routes/tailor-made.routes/getAllTailor.routes.js";
import getSpecificTailorRouter from "./routes/tailor-made.routes/getAllTailormade.routes.js";
import replyTailerRouter from "./routes/tailor-made.routes/replyTailorMade.routes.js";
import deleteTailorRouter from "./routes/tailor-made.routes/deleteSpecificTailor.routes.js";
import {addTrekRouter,editTrekRouter} from "./routes/trek.routes/addTrek.routes.js";
import getAllTrekRouter from "./routes/trek.routes/getAllTrek.routes.js";
import getSpecificTrekRouter from "./routes/trek.routes/getSpecifictrek.routes.js";
import getSelectedDataForTrekRouter from "./routes/trek.routes/getSelectedTrekData.routes.js";
import getTourByTourTypesRouter from "./routes/tours.routes/getTourByTourTypes.routes.js";
import deleteAccommodationRouter from "./routes/accommodation.routes/deleteAccommodation.routes.js";
import deleteRoomRouter from "./routes/room.routes/deleteRoom.routes.js";
import deleteTourRouter from "./routes/tours.routes/deleteTours.routes.js";
import deleteTrekRouter from "./routes/trek.routes/deleteTrek.routes.js";
import getDashboardDataRouter from "./routes/dashboard.routes/getDashboardData.routes.js";
import getAgentRouter from "./routes/bluk.routes/getAllUserData.routes.js";
import addAgentRouter from "./routes/bluk.routes/addAgent.routes.js";
import bulkmailRouter from "./routes/bluk.routes/sendBulkMail.routes.js";
import deleteUserRouter from "./routes/bluk.routes/deleteUser.routes.js";
import editAgentRouter from "./routes/bluk.routes/editAgent.routes.js";
import { bookingRouter } from "./routes/booking.routes/booking.routes.js";


const app = express();


// Connect to database
dbConnection();

const port = process.env.PORT || 4000; 

app.use(express.json());
app.use(urlencoded({extended:true}))
app.use(cookieParser())

// Middleware to serve static files (make uploaded images accessible)
// Serve static files from "public/uploads" directory
// app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.use(
    cors({
      origin: ["http://localhost:3000", "https://luxuryescape-admin.vercel.app", "https://www.nepalluxuryescapes.com", "https://admin.nepalluxuryescapes.com"],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true, // Allow cookies
    })
  );
  

app.use(
    signupRouter,
    loginRouter,
    otpRouter,

    //dashboard
    getDashboardDataRouter,

    //for tours
    addTourRouter,
    activeteTourRouter,
    getSpecifictourRouter,
    getSelectedDataRouter,
    getTourByTourTypesRouter,
    deleteTourRouter,
    editTourRouter,

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
    getSelectedAccommodationDataRouter,
    deleteAccommodationRouter,
    editAccommodationRouter,

    //for blogs
    addBlogRouter,
    getAllBlogRouter,
    getSpecificBlogRouter,
    editBlogRouter,
    deleteBlogRouter,
    updateBlogStatusRouter,

    //for Rooms,
    addRoomRouter,
    getAllRoomRouter,
    deleteRoomRouter,
    editRoomRouter,

    //for contact
    addContactRouter,

    //for quote
    addQuoteRouter,
    getAllQuoteRouter,
    getSpecificQuoteRouter,
    replyQuoteRouter,
    deleteQuoteRouter,
    deleteAllQuoteRouter,

    //for tailor-made
    addTailormadeRouter,
    getAllTailormadeRouter,
    getSpecificTailorRouter,
    replyTailerRouter,
    deleteTailorRouter,


    // for treks
    addTrekRouter,
    getAllTrekRouter,
    getSpecificTrekRouter,
    getSelectedDataForTrekRouter,
    deleteTrekRouter,
    editTrekRouter,

    //bulk mail
    getAgentRouter,
    addAgentRouter,
    bulkmailRouter,
    deleteUserRouter,
    editAgentRouter,

    //booking
    bookingRouter

)



app.get("/", (req: Request, res: Response) => {
    res.send("Hello World");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


