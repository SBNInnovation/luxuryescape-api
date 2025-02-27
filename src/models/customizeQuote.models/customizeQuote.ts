import { Schema } from "mongoose";
import mongoose from "mongoose";

const customizeQuoteSchema = new Schema({
    name:{type:String, required:true},
    email:{type:String, required:true},
    number:{type:String, required:true},
    message:{type:String , required:true},
    tourName:{type:String, default:""},
    trekName:{type:String, default:""},
    type:{type:String},
    tourId:{type:mongoose.Schema.Types.ObjectId, ref:"Tour", default:null},
    trekId:{type:mongoose.Schema.Types.ObjectId, ref:"Trek", default:null},
    status:{type:String, default:"pending"} 
    
},{
    timestamps:true
}
)

const CustomizeQuote = mongoose.model("CustomizeQuote", customizeQuoteSchema);

export default CustomizeQuote