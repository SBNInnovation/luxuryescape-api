import { Schema } from "mongoose";
import mongoose from "mongoose";

const tourTypeSchema = new Schema({
    tourType:{type:String, trim:true , unique:true},
    description:{type:String, trim:true},
    thumbnail:{type:String},
},{
    timestamps:true
})

const TourTypes = mongoose.model("TourTypes",tourTypeSchema);

export default TourTypes;