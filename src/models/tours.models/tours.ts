import mongoose, { Schema } from "mongoose";

// Links Schema
const linksSchema = new Schema(
  {
    text: { type: String, required: true, trim: true },
    url: {
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
    description: { type: String, required: true, trim: true},
    accommodation: [{ type: mongoose.Schema.Types.ObjectId, ref: "Accommodation" }],
    fineDining:[{type:mongoose.Schema.Types.ObjectId, ref:"FineDining"}],
    note:{type:String},
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
    routeMap:{type:String, default:""},
    gallery: { type: [String], default: [] },
    country: { type: String, enum: ["Nepal", "Bhutan", "Tibet", "Multidestinations"], required: true },
    location: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    idealTime: { type: [String], required: true, trim: true },
    cost: { type: Number, min: 0 },
    tourTypes: { type: mongoose.Schema.Types.ObjectId, ref:"TourTypes"},
    tourOverview: { type: String, required: true, trim: true},
    tourHighlights: {type: [String], trim: true, default: [] },
    // highlightPicture:{type:[String],default:[]},
    tourInclusion: { type: [String], default: [] },
    tourExclusion: { type: [String], default: [] },
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
    isActivate: { type: Boolean, default: true },
    viewsCount:{type:Number, default:0}
  },
  { timestamps: true }
);

// Model
const Tour = mongoose.model("Tour", tourSchema);

export default Tour;
