import mongoose from "mongoose";
import { Schema } from "mongoose";


const accommodationDetails = new Schema(
    {
      accommodationTitle: { type: String, required: true }, 
      accommodationPics: { type: [String], default:""}, 
      accomodationDescription: { type: String, required: true }
    },
    {
      _id: false
    }
  );

const itineraryDetails = new Schema(
    {
      day: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
      itineraryDayPhoto: { type: String, default:""},
      accommodation: [accommodationDetails] 
    },
    {
      _id: false
    }
  );

const addTours = new Schema({
    tourName:{type:String, required:true},
    slug:{type:String, required:true},
    thumbnail :{type:String},
    duration:{type:String, required:true},
    idealTime:{type:String, required:true},
    cost: {type:String, required:true},
    tourTypes: {type:String, required:true},
    destination:[{
                    destinationDays: { type: String, required: true },
                    destinationPlace: { type: String, required: true }, 
                    destinationPhoto: { type: String , default:""}
                }],
    tourOverview:{type:String, required:true},
    keyHighlights:{type:[String]},
    tourHighlights:[{
                        highlightsTitle:{type:String, required:true},
                        highlightPicture: {type:String, default:""}
                }],
    tourItinerary: {
        mainOverview:{type:String, required:true},
        itinerary:[itineraryDetails]
    },
    faq: [{
        question: {type:String},
        answer: {type:String}
    }],
    isRecommend:{type:Boolean,default:false},
    isActivate:{type:Boolean,default:false}
},
{
  timestamps:true
}
)

const Tour = mongoose.model("Tour", addTours)

export default Tour
