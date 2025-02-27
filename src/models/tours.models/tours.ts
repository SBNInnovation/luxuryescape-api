import mongoose, { Schema } from "mongoose";

// Links Schema
const linksSchema = new Schema(
  {
    key: { type: String, required: true, trim: true },
    value: {
      type: String,
      required: true,
      trim: true
    },
  },
  { _id: false }  
);

// Itinerary Details Schema
const itineraryDetailsSchema = new Schema(
  {
    day: { type: String, required: true, trim:true }, 
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true, minLength: 10 },
    accommodation: [{ type: mongoose.Schema.Types.ObjectId, ref: "Accommodation" }],
    links: { type: [linksSchema], default: [] },
  },
  { _id: false }
);

// Tour Schema
const tourSchema = new Schema(
  {
    tourName: { type: String, required: true, trim: true},
    slug: { type: String, required: true, unique: true, lowercase: true },
    type:{type:String, default:"tour"},
    thumbnail: { type: String, default: "" },
    gallery: { type: [String], default: [] },
    country: { type: String, enum: ["Nepal", "Bhutan", "Tibet"], required: true },
    location: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    idealTime: { type: [String], required: true, trim: true },
    cost: { type: Number, required: true, min: 0 },
    tourTypes: { type: mongoose.Schema.Types.ObjectId, ref:"TourTypes"},
    tourOverview: { type: String, required: true, trim: true, minLength: 10 },
    tourHighlights: {type: [String], trim: true, default: [] },
    highlightPicture:{type:[String],default:[]},
    tourInclusion: { type: [String], default: [] },
    tourItinerary: { type: [itineraryDetailsSchema], default: [] },
    itineraryDayPhoto: { type: [String], default: [] },
    faq: {
      type: [
        {
          question: { type: String, required: true, trim: true },
          answer: { type: String, required: true, trim: true },
          _id:false
        }
      ],
      default: [],
    },
    isRecommend: { type: Boolean, default: false },
    isActivate: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Model
const Tour = mongoose.model("Tour", tourSchema);

export default Tour;
