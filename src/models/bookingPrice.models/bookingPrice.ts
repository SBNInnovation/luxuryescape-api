
import mongoose from "mongoose"

const bookingPriceSchema = new mongoose.Schema(
  {
    adventureType: { type: String, required: true },
    trekId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trek",
      default: null,
    },
    tourId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      default: null,
    },
    singleSupplementaryFourStar: {
      type: Number,
      default: 0,
    },
    singleSupplementaryFiveStar: {
      type: Number,
      default: 0,
    },
    solo:{
      type:Number,
      default:0
    },
    soloFourStar: {
      type: Number,
      required: true,
    },
    soloFiveStar: {
      type: Number,
      required: true,
    },
    standardFourStar: {
      type: Number,
      required: true,
    },
    standardFiveStar: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const BookingPrice = mongoose.model("BookingPrice", bookingPriceSchema)
export { BookingPrice }