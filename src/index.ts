import express, { Request, Response, urlencoded } from "express";
import dotenv from "dotenv";
dotenv.config()
import dbConnection from "./connectDB";
import addTourRouter from "./routes/tours.routes/addtours.routes";
import signupRouter from "./routes/login&signup/signupRouter";
import loginRouter from "./routes/login&signup/loginRoutes";
import cookieParser from "cookie-parser";

const app = express();

// Connect to database
dbConnection();

const port = process.env.PORT || 4000;  // Use PORT from .env or default to 4000

app.use(express.json());
app.use(urlencoded({extended:true}))
app.use(cookieParser())

app.use("/api/v1",addTourRouter)

//for signup and login 
app.use(signupRouter,loginRouter)

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
