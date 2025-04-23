import mongoose, { Schema } from "mongoose";

const recommendedSchema = new Schema({
   affiliatedAccommodation: { type: String},
    thumbnail :{ type:String},
    link:{ type: String }
})

const Recommend = mongoose.model("Recommend",recommendedSchema)

export default Recommend;