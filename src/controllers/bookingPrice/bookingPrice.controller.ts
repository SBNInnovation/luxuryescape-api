import { Request, Response } from "express"
import { BookingPrice } from "../../models/bookingPrice.models/bookingPrice.js"


const addBookingPrice = async (req: Request, res: Response): Promise<void> => {
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

    const bookingPrice = new BookingPrice({
      adventureType,
      trekId: adventureType === "Trekking" ? adventureId : null,
      tourId: adventureType === "Tour" ? adventureId : null,
      pricePerPerson,
      discount,
      soloFourStar,
      soloFiveStar,
      singleSupplementaryFourStar,
      singleSupplementaryFiveStar,
      standardFourStar,
      standardFiveStar,
    })

    await bookingPrice.save()

    res.status(200).json({
      success: true,
      message: "Booking price added successfully",
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

export default addBookingPrice;
