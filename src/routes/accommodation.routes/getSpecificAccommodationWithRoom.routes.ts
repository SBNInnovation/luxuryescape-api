    import express from "express";
    import getSpecificAccommodationWithRoom from "../../controllers/accommodations/getSpecificAccommodationWithRoom.controller.js";




    const getSpecificAccommodationWithRoomRouter = express.Router();

    getSpecificAccommodationWithRoomRouter.route("/accommodation/get-by/:slug").get(getSpecificAccommodationWithRoom)

    export default getSpecificAccommodationWithRoomRouter