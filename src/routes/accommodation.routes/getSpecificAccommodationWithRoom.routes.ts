    import express from "express";
    import getSpecificAccommodationWithRoom from "../../controllers/accommodations/getSpecificAccommodationWithRoom.controller.js";
import makeFeaturedAcco from "../../controllers/accommodations/addFeaturedAcco.controller.js";




    const getSpecificAccommodationWithRoomRouter = express.Router();

    getSpecificAccommodationWithRoomRouter.route("/accommodation/get-by/:slug").get(getSpecificAccommodationWithRoom)

    //for isfeature
    getSpecificAccommodationWithRoomRouter.route("/accommodation/update/:accommodationId").patch(makeFeaturedAcco)

    export default getSpecificAccommodationWithRoomRouter