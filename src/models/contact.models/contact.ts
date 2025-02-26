import { Schema } from "mongoose";
import mongoose from "mongoose";

const contactSchema = new Schema({
    name:{type:String, required:true},
    email:{type:String, required:true},
    number:{type:String, required:true},
    message:{type:String , required:true}
})

const Contact = mongoose.model("CustomizeQuote",contactSchema)

export default Contact