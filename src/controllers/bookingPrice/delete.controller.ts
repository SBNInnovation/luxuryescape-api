import { Request, Response } from "express"
import { BookingPrice } from "../../models/bookingPrice.models/bookingPrice.js"


const deleteBookingPrice = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const bookingPriceId = req.params.bookingPriceId
  
      const bookingPrice = await BookingPrice.findByIdAndDelete(bookingPriceId)
  
      if (!bookingPrice) {
        res.status(404).json({
          message: "Booking price not found",
        })
        return
      }
  
      res.status(200).json({
        success: true,
        message: "Booking price deleted successfully",
      })
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message,
        })
      }
    }
  }

  export default deleteBookingPrice;
  