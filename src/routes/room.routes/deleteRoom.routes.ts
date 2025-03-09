import express from "express";
import deleteRoom from "../../controllers/rooms/delete.room.controller.js";

const deleteRoomRouter = express.Router();

deleteRoomRouter.route("/room/delete/:roomId").delete(deleteRoom)

export default deleteRoomRouter