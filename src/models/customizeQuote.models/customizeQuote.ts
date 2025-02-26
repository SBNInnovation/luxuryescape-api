import { Schema } from "mongoose";
import mongoose from "mongoose";

const customizeQuoteSchema = new Schema({
    name:{type:String, required:true},
    email:{type:String, required:true},
    number:{type:String, required:true},
    message:{type:String , required:true}
})

const CustomizeQuote = mongoose.model("CustomizeQuote",customizeQuoteSchema)

export default CustomizeQuote