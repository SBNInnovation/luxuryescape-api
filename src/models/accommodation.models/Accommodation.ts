import { Schema } from "mongoose";
import mongoose from "mongoose";

// Accommodation Details Schema
const accommodationDetailsSchema = new Schema({
  accommodationPics: { type: [String], default: [] },
  accommodationTitle: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true , index: true},
  country:{type:String, required:true, trim:true},
  accommodationLocation: { type: String, required: true, trim: true },
  accommodationRating: { type: Number, min: 0, max: 5 }, // Ratings typically range 0-5
  accommodationDescription: { type: String, required: true, trim: true, minLength: 10 },
  accommodationFeatures: { type: [String], default: [] },
  accommodationAmenities: { type: [String], default: [] },
  policies :{
    checkInTime : {type : String},
    checkOutTime : {type : String},
    cancellationPolicy : {type : String},
    pets: {type: String}
  }
},{
  timestamps:true
});

// Model
const Accommodation = mongoose.model("Accommodation", accommodationDetailsSchema);

export default Accommodation;
