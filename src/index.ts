import express, { Request, Response, urlencoded } from "express";
import dotenv from "dotenv";
dotenv.config()

import addTourRouter from "./routes/tours.routes/addtours.routes";
import signupRouter from "./routes/login&signup/signupRouter";
import loginRouter from "./routes/login&signup/loginRoutes";
import cookieParser from "cookie-parser";
import otpRouter from "./routes/otp/otpRoutes";
import getActivateTourRouter from "./routes/tours.routes/getActivateTours.routes";
import getAllTourRouter from "./routes/tours.routes/getAllTours.routes";
import activeteTourRouter from "./routes/tours.routes/activateTours.routes";
import getRecommendTourRouter from "./routes/tours.routes/getRecommendTours.routes";
import recommendTourRouter from "./routes/tours.routes/recommendTours.routes";
import dbConnection from "./connectDB";

const app = express();

// Connect to database
dbConnection();

const port = process.env.PORT || 4000;  // Use PORT from .env or default to 4000

app.use(express.json());
app.use(urlencoded({extended:true}))
app.use(cookieParser())

//for client route
app.use(
    getActivateTourRouter,
    getRecommendTourRouter
)
//for adminpanel route
app.use("/admin",
    signupRouter,
    loginRouter,
    otpRouter,
    addTourRouter,
    getAllTourRouter,
    activeteTourRouter,
    recommendTourRouter
)



app.get("/", (req: Request, res: Response) => {
    res.send("Hello World");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
