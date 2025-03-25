import express from "express"
import { createBooking } from "../../controllers/bookings/createBooking.controller.js"
import { getBooking } from "../../controllers/bookings/getAll.controllers.js"
import { deleteBooking } from "../../controllers/bookings/delete.controllers.js"
import { viewSingle } from "../../controllers/bookings/viewSingle.js"

const bookingRouter = express.Router()

bookingRouter.post("/booking/create", createBooking)
bookingRouter.get("/booking/get-all", getBooking)
bookingRouter.delete("/booking/delete/:id", deleteBooking)
bookingRouter.get("/booking/view/:id", viewSingle)


export { bookingRouter }