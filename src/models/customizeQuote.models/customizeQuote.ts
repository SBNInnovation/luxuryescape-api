import { Schema } from "mongoose";
import mongoose from "mongoose";

const customizeQuoteSchema = new Schema({
    name:{type:String, required:true},
    email:{type:String, required:true},
    number:{type:String, required:true},
    message:{type:String , required:true},
    tourName:{type:String, required:true},
    status:{type:String, default:"pending"}
})

const CustomizeQuote = mongoose.model("CustomizeQuote", customizeQuoteSchema);

export default CustomizeQuote