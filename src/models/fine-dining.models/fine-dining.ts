import { Schema } from "mongoose";
import mongoose from "mongoose";

// fineDining Details Schema
const fineDiningDetailsSchema = new Schema({
  pics: { type: [String], default: [] },
  logo: {type:String},
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true , index: true},
  type:{type:String, default:"fine-dining"},
  country:{type:String, required:true, trim:true},
  destination: {
    type: mongoose.Schema.Types.ObjectId, // or String, depending on your logic
    ref: "Destination", // reference if using ObjectId
    required: true
  },
  location: { type: String, required: true, trim: true },
  rating: { type: Number, min: 0, max: 8 }, // Ratings typically range 0-5
  description: { type: String, required: true, trim: true},
  features: { type: [String], default: [] },
  amenities: { type: [String], default: [] },
  policies :{
    checkInTime : {type : String},
    checkOutTime : {type : String},
    cancellationPolicy : {type : String},
    pets: {type: String}
  },
  isFeature:{type:Boolean, default:false}
},{
  timestamps:true
});

// Model
const FineDining = mongoose.model("FineDining", fineDiningDetailsSchema);

export default FineDining;
