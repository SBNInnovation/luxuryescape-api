import mongoose, { Schema } from "mongoose";

// Links Schema
const linksSchema = new Schema(
  {
    linkTitle: { type: String, required: true, trim: true },
    linkUrl: {
      type: String,
      required: true,
      trim: true,
      // match: /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-]+)*\/?$/,
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
    itineraryDayPhoto: { type: String, default: "" },
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
    thumbnail: { type: String, default: "" },
    gallery: { type: [String], default: [] },
    country: { type: String, enum: ["Nepal", "Bhutan", "Tibet"], required: true },
    location: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    idealTime: { type: [String], required: true, trim: true },
    cost: { type: Number, required: true, min: 0 },
    tourTypes: { type: mongoose.Schema.Types.ObjectId, ref:"TourTypes"},
    tourOverview: { type: String, required: true, trim: true, minLength: 10 },
    keyHighlights: { type: [String], default: [] },
    tourHighlights: {
      type: [
        {
          highlightsTitle: { type: String, trim: true },
          highlightPicture: { type: String, default: "" },
          _id:false
        }
      ],
      default: [],
    },
    tourInclusion: { type: [String], default: [] },
    tourItinerary: { type: [itineraryDetailsSchema], default: [] },
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
