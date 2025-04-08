
// import { Request, Response } from "express"
// import { Booking } from "../../models/booking.models/booking.js"

// const viewSingle = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const bookingId = req.params.id
//     if (!bookingId) {
//       res
//         .status(404)
//         .json({ success: false, message: "Booking Id is required" })
//       return
//     }

//     const singleRequest = await Booking.findById(bookingId)
//     if (!singleRequest) {
//       res
//         .status(404)
//         .json({ success: false, message: "Request Not Found" })
//       return
//     }

//     singleRequest.status = "viewed"
//     await singleRequest.save()

//     res.status(200).json({
//       success: true,
//       message: "Booking Request Found",
//       data: singleRequest,
//     })
//   } catch (error) {
//     console.log("View Single Bookings error:", error)
//     res.status(400).json({
//       success: false,
//       message: "Internal server error",
//     })
//   }
// }

// export { viewSingle }







import { Request, Response } from "express"
import { Booking } from "../../models/booking.models/booking.js"

const viewSingle = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookingId = req.params.id

    if (!bookingId) {
      res.status(400).json({ success: false, message: "Booking Id is required" })
      return
    }

    const booking = await Booking.findById(bookingId)

    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found" })
      return
    }

    booking.status = "viewed"
    await booking.save()

    let populatedBooking = null

    if (booking.trekId) {
      populatedBooking = await Booking.findById(bookingId).populate("trekId", "country")
    } else if (booking.tourId) {
      populatedBooking = await Booking.findById(bookingId).populate("tourId", "country")
    } else {
      populatedBooking = booking
    }

    res.status(200).json({
      success: true,
      message: "Booking Request Found",
      data: populatedBooking,
    })
  } catch (error) {
    console.error("View Single Booking error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

export { viewSingle }
