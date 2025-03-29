import express from "express"
import { createBooking } from "../../controllers/bookings/createBooking.controller.js"
import { getBooking } from "../../controllers/bookings/getAll.controllers.js"
import { deleteBooking } from "../../controllers/bookings/delete.controllers.js"
import { viewSingle } from "../../controllers/bookings/viewSingle.js"
import addBookingPrice from "../../controllers/bookingPrice/bookingPrice.controller.js"
import updateBookingPrice from "../../controllers/bookingPrice/update.controller.js"
import deleteBookingPrice from "../../controllers/bookingPrice/delete.controller.js"
import getSingleBookingPrice from "../../controllers/bookingPrice/getSingle.controller.js"
import multer from "multer"
import sendBookingMail from "../../controllers/bookings/sendBookingMail.controller.js"

const bookingRouter = express.Router()

interface MulterRequest extends express.Request {
  files: {
    attachments: Express.Multer.File[]
  }
}

// Configure storage (memory storage for buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

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
bookingRouter.post(
  "/send-booking-mail/:id",
  upload.single(
    "attachments"
  ),
  (req, res) => {
    sendBookingMail(req as MulterRequest, res)
  }
)


export { bookingRouter }