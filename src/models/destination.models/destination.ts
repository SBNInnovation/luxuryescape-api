import mongoose, { Schema } from "mongoose"
import slug from "slug";


const destinations  = new Schema({
    caption:{type:String},
    image:{type:String},
},{
    _id:false
})

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
    thumbnail:{
        type:String
    },
    destinations:{
        type:[destinations],
        default:[]
    }
})

const Destination = mongoose.model("Destination",destinationSchema);

export default Destination;