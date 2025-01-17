import mongoose, { Schema } from "mongoose";

// Room Details Schema
const roomDetailsSchema = new Schema(
  {
    roomTitle: { type: String, required: true, trim: true },
    roomPhotos: { type: [String], default: [] },
    roomStandard: { type: String, required: true, trim: true },
    roomDescription: { type: String, required: true, trim: true, minLength: 100 },
    roomFacilities: { type: [String], required: true, default: [] },
  },
  { _id: false } 
);

// Accommodation Details Schema
const accommodationDetailsSchema = new Schema(
  {
    accommodationPics: { type: [String], default: [] },
    accommodationTitle: { type: String, required: true, trim: true },
    accommodationLocation: { type: String, required: true, trim: true },
    accommodationRating: { type: Number, min: 0, max: 5 }, // Ratings typically range 0-5
    accommodationDescription: { type: String, required: true, trim: true, minLength: 100 },
    accommodationFeatures: { type: [String], default: [] },
    accommodationAmenities: { type: [String], default: [] },
    rooms: { type: [roomDetailsSchema], default: [] },
  },
  { _id: false }
);

// Links Schema
const linksSchema = new Schema(
  {
    linkTitle: { type: String, required: true, trim: true },
    linkUrl: {
      type: String,
      required: true,
      trim: true,
      match: /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-]+)*\/?$/,
    },
  },
  { _id: false }
);

// Itinerary Details Schema
const itineraryDetailsSchema = new Schema(
  {
    day: { type: String, required: true, trim:true }, 
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true, minLength: 150 },
    itineraryDayPhoto: { type: String, default: "" },
    accommodation: { type: [accommodationDetailsSchema], default: [] },
    links: { type: [linksSchema], default: [] },
  },
  { _id: false }
);

// Tour Schema
const tourSchema = new Schema(
  {
    tourName: { type: String, required: true, trim: true, minLength: 5 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    thumbnail: { type: String, default: "" },
    gallery: { type: [String], default: [] },
    country: { type: String, enum: ["Nepal", "Bhutan", "Tibet"], required: true },
    location: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    idealTime: { type: String, required: true, trim: true },
    cost: { type: Number, required: true, min: 0 },
    tourTypes: { type: String, required: true, trim: true },
    destination: {
      type: [
        {
          destinationDays: { type: Number, required: true, min: 1 },
          destinationPlace: { type: String, required: true, trim: true },
          destinationPhoto: { type: String, default: "" },
        },
      ],
      default: [],
    },
    tourOverview: { type: String, required: true, trim: true, minLength: 150 },
    keyHighlights: { type: [String], default: [] },
    tourHighlights: {
      type: [
        {
          highlightsTitle: { type: String, required: true, trim: true },
          highlightPicture: { type: String, default: "" },
        },
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
        },
      ],
      default: [],
    },
    isRecommend: { type: Boolean, default: false },
    isActivate: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Model
const Tour = mongoose.model("Tour", tourSchema);

export default Tour;
