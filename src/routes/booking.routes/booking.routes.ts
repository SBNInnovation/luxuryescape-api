import express from "express"
import { createBooking } from "../../controllers/bookings/createBooking.controller.js"
import { getBooking } from "../../controllers/bookings/getAll.controllers.js"
import { deleteBooking } from "../../controllers/bookings/delete.controllers.js"
import { viewSingle } from "../../controllers/bookings/viewSingle.js"
import addBookingPrice from "../../controllers/bookingPrice/bookingPrice.controller.js"
import updateBookingPrice from "../../controllers/bookingPrice/update.controller.js"
import deleteBookingPrice from "../../controllers/bookingPrice/delete.controller.js"
import getSingleBookingPrice from "../../controllers/bookingPrice/getSingle.controller.js"

const bookingRouter = express.Router()

bookingRouter.post("/booking/create", createBooking)
bookingRouter.get("/booking/get-all", getBooking)
bookingRouter.delete("/booking/delete/:id", deleteBooking)
bookingRouter.get("/booking/view/:id", viewSingle)


//for booking prices
bookingRouter.post("/add-booking-price", addBookingPrice)
bookingRouter.put("/update-booking-price", updateBookingPrice)
bookingRouter.delete("/delete-booking-price/:bookingPriceId", deleteBookingPrice)
bookingRouter.get(
  "/get-single-booking-price/:adventureId/:adventureType",
  getSingleBookingPrice
)


export { bookingRouter }