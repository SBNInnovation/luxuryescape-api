import mongoose, { Schema } from "mongoose"

const destinationSchema = new Schema({
    title:{
        type:String,
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