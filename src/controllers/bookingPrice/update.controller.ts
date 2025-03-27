import { Request, Response } from "express"
import { BookingPrice } from "../../models/bookingPrice.models/bookingPrice.js"

const updateBookingPrice = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      adventureType,
      adventureId,
      pricePerPerson,
      discount,
      soloFourStar,
      soloFiveStar,
      singleSupplementaryFourStar,
      singleSupplementaryFiveStar,
      standardFourStar,
      standardFiveStar,
    } = req.body

    if (
      !adventureType ||
      !adventureId ||
      !pricePerPerson ||
      !soloFourStar ||
      !soloFiveStar ||
      !singleSupplementaryFourStar ||
      !singleSupplementaryFiveStar ||
      !standardFourStar ||
      !standardFiveStar
    ) {
      res.status(404).json({
        message: "Please fill all the fields",
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

    const bookingPrice = await BookingPrice.findOneAndUpdate(
      query,
      {
        pricePerPerson,
        discount,
        soloFourStar,
        soloFiveStar,
        singleSupplementaryFourStar,
        singleSupplementaryFiveStar,
        standardFourStar,
        standardFiveStar,
      },
      { new: true }
    )

    if (!bookingPrice) {
      res.status(404).json({
        message: "Booking price not found",
      })
      return
    }

    res.status(200).json({
      success: true,
      message: "Booking price updated successfully",
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

export default updateBookingPrice