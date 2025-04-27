import mongoose, { Schema } from "mongoose";

const recommendedSchema = new Schema({
   affiliatedAccommodation: { type: String},
    thumbnail :{ type:String},
    link:{ type: String },
    destination:{type:mongoose.Schema.Types.ObjectId, ref:"Destination"}
})

const Recommend = mongoose.model("Recommend",recommendedSchema)

export default Recommend;