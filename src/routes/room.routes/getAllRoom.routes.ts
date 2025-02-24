import express from "express";
import getAllRoom from "../../controllers/rooms/getAllRoom.controller.js";


const getAllRoomRouter = express.Router();

getAllRoomRouter.route("/room/get-all-room").get(getAllRoom)

export default getAllRoomRouter;