import { Schema } from "mongoose";
import mongoose from "mongoose";

// Links Schema
const linksSchema = new Schema(
  {
    text: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
  },
  { _id: false }
);

// Itinerary Details Schema
const itineraryDetailsSchema = new Schema(
  {
    day: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true, minLength: 10 },
    accommodation: [{ type: mongoose.Schema.Types.ObjectId, ref: "Accommodation" }],
    links: { type: [linksSchema], default: [] },
  },
  { _id: false }
);

// Trek Schema
const trekSchema = new Schema(
  {
    trekName: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    type: { type: String, default: "trek" },
    thumbnail: { type: String, default: "" },
    gallery: { type: [String], default: [] },
    country: { type: String, enum: ["Nepal", "Bhutan", "Tibet", "Multidestinations"], required: true },
    location: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    idealTime: { type: [String], required: true, trim: true },
    cost: { type: Number, required: true, min: 0 },
    difficultyLevel: { type: String, enum: ["Easy", "Moderate", "Hard"], required: true },
    trekOverview: { type: String, required: true, trim: true, minLength: 10 },
    trekHighlights: { type: [String], trim: true, default: [] },
    highlightPicture: { type: [String], default: [] },
    trekInclusion: { type: [String], default: [] },
    trekExclusion: { type: [String], default: [] },
    trekItinerary: { type: [itineraryDetailsSchema], default: [] },
    itineraryDayPhoto: { type: [String], default: [] },
    faq: {
      type: [
        {
          question: { type: String, required: true, trim: true },
          answer: { type: String, required: true, trim: true },
          _id: false,
        },
      ],
      default: [],
    },
    isRecommend: { type: Boolean, default: false },
    isActivate: { type: Boolean, default: true },
    viewsCount:{type:Number, default:0}
  },
  { timestamps: true }
);

// Model
const Trek = mongoose.model("Trek", trekSchema);

export default Trek;
