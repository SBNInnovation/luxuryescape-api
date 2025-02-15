import express from "express";
import getAllRoom from "../../controllers/rooms/getAllRoom.controller.js";


const getAllRoomRouter = express.Router();

getAllRoomRouter.route("/accommodation/get-all-accommodation").get(getAllRoom)

export default getAllRoomRouter;