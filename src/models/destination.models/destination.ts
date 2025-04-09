import mongoose, { Schema } from "mongoose"
import slug from "slug";

const destinationSchema = new Schema({
    title:{
        type:String,
    },
    slug:{
        type:String,
        unique:true
    },
    description:{
        type:String
    },
    image:{
        type:String
    },

})

const Destination = mongoose.model("Destination",destinationSchema);

export default Destination;