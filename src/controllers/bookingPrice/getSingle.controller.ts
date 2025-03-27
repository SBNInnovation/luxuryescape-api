import { Request, Response } from "express"
import { BookingPrice } from "../../models/bookingPrice.models/bookingPrice.js"

const getSingleBookingPrice = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { adventureId, adventureType } = req.params
  
      if (!adventureType || !adventureId) {
        res.status(404).json({
          message: "Please provide adventureType and adventureId",
        })
        return
      }
  
      // Define the query interface
      interface BookingPriceQuery {
        adventureType: string
        trekId?: string | null
        tourId?: string | null
      }
  
      // Initialize with base query
      const query: BookingPriceQuery = { adventureType }
  
      // Add the appropriate ID field based on adventure type
      if (adventureType === "Trekking") {
        query.trekId = adventureId
      } else if (adventureType === "Tour") {
        query.tourId = adventureId
      }
  
      const bookingPrice = await BookingPrice.findOne(query)
  
      if (!bookingPrice) {
        res.status(404).json({
          message: "Booking price not found",
        })
        return
      }
  
      res.status(200).json({
        success: true,
        bookingPrice,
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

  export default getSingleBookingPrice;