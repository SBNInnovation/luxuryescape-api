import { Schema } from "mongoose";
import mongoose from "mongoose";

const agentSchema = new Schema({
    name:{type:String, required:true},
    email:{type:String, required:true},
    number:{type:String, required:true},
    country:{type:String, required:true},
    company:{type:String},
    address:{type:String}
},{
    timestamps:true
}
)

const Agent = mongoose.model("Agent", agentSchema);

export default Agent