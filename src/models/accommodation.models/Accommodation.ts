import { Schema } from "mongoose";
import mongoose from "mongoose";

// Room Details Schema
const roomDetailsSchema = new Schema(
  {
    roomTitle: { type: String, required: true, trim: true }, //removes leading and trailing whitespace from a string field before saving it to the database.
    roomPhotos: { type: [String], default: [] },
    roomStandard: { type: String, required: true, trim: true },
    roomDescription: { type: String, required: true, trim: true, minLength: 10 },
    roomFacilities: { type: [String], required: true, default: [] },
  },
  { _id: false }
);

// Accommodation Details Schema
const accommodationDetailsSchema = new Schema({
  accommodationPics: { type: [String], default: [] },
  accommodationTitle: { type: String, required: true, trim: true },
  accommodationLocation: { type: String, required: true, trim: true },
  accommodationRating: { type: Number, min: 0, max: 5 }, // Ratings typically range 0-5
  accommodationDescription: { type: String, required: true, trim: true, minLength: 10 },
  accommodationFeatures: { type: [String], default: [] },
  accommodationAmenities: { type: [String], default: [] },
  rooms: { type: [roomDetailsSchema], default: [] },
},{
  timestamps:true
});

// Model
const Accommodation = mongoose.model("Accommodation", accommodationDetailsSchema);

export default Accommodation;
