import express, { Request, Response, urlencoded } from "express";
import dotenv from "dotenv";
dotenv.config()

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

const app = express();

// Connect to database
dbConnection();

const port = process.env.PORT || 4000;  // Use PORT from .env or default to 4000

app.use(express.json());
app.use(urlencoded({extended:true}))
app.use(cookieParser())

app.use(
    signupRouter,
    loginRouter,
    otpRouter,
    addTourRouter,
    getAllTourRouter,
    activeteTourRouter,
    recommendTourRouter,
    getActivateTourRouter,
    getRecommendTourRouter,
    getSpecifictourRouter
)



app.get("/", (req: Request, res: Response) => {
    res.send("Hello World");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
