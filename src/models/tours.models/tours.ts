import mongoose, { Schema } from "mongoose";

const accommodationDetails = new Schema(
  {
    accommodationTitle: { type: String, required: true },
    accommodationPics: { type: [String], default: [] },
    accommodationDescription: { type: String, required: true }, // Fixed spelling
  },
  {
    _id: false,
  }
);

const links = new Schema({
  linkTitle: { type: String, required: true },
  linkUrl: { type: String, required: true },
})

const itineraryDetails = new Schema(
  {
    day: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    itineraryDayPhoto: { type: String, default: "" },
    accommodation: { type: [accommodationDetails], default: [] },
    links: [links]
  },
  {
    _id: false,
  }
);

const addTours = new Schema(
  {
    tourName: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    gallery: { type: [String], default: [] },
    country: { type: String, enum: ["Nepal", "Bhutan", "Tibet"], required: true },
    location: { type: String, required: true },
    duration: { type: String, required: true },
    idealTime: { type: String, required: true },
    cost: { type: String, required: true },
    tourTypes: { type: String, required: true },
    destination: {
      type: [
        {
          destinationDays: { type: String, required: true },
          destinationPlace: { type: String, required: true },
          destinationPhoto: { type: String, default: "" },
        },
      ],
      default: [],
    },
    tourOverview: { type: String, required: true },
    keyHighlights: { type: [String], default: [] },
    tourHighlights: {
      type: [
        {
          highlightsTitle: { type: String, required: true },
          highlightPicture: { type: String, default: "" },
        },
      ],
      default: [],
    },
    tourInclusion:{type:[String],default:[]},
    tourItinerary: [itineraryDetails],
    faq: {
      type: [
        {
          question: { type: String },
          answer: { type: String},
        },
      ],
      default: [],
    },
    isRecommend: { type: Boolean, default: false },
    isActivate: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Tour = mongoose.model("Tour", addTours);

export default Tour;
