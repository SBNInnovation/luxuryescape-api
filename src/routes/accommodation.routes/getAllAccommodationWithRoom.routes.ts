import express from "express";
import getAllAccommodationsWithRooms from "../../controllers/accommodations/getAllAccommodationWithRooms.controller.js";

const getAllAccommodationWithRoomRouter = express.Router();

getAllAccommodationWithRoomRouter.route("/accommodation/get-all-details").get(getAllAccommodationsWithRooms)

export default getAllAccommodationWithRoomRouter