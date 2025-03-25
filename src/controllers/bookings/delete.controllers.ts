import { Request, Response } from "express"
import { Booking } from "../../models/booking.models/booking.js"

const deleteBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    if (!id) {
      res
        .status(404)
        .json({ success: false, message: "Please provide booking id" })
      return
    }

    const booking = await Booking.findByIdAndDelete(id)

    if (!booking) {
      res
        .status(404)
        .json({ success: false, message: "Booking not found" })
      return
    }

    res
      .status(200)
      .json({ success: true, message: "Booking deleted successfully" })
  } catch (error) {
    console.log("Delete Booking error:", error)
    res
      .status(400)
      .json({ success: false, message: "Internal server error" })
  }
}

export { deleteBooking }