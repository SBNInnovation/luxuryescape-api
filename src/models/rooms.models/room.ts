import { Schema } from "mongoose";
import mongoose from "mongoose";

const roomDetailsSchema = new Schema(
    {
      roomTitle: { type: String, trim: true }, //removes leading and trailing whitespace from a string field before saving it to the database.
      slug: { type: String, required: true, unique: true, lowercase: true },
      roomPhotos: { type: [String], default: [] },
      // roomStandard: { type: String, required: true, trim: true },
      roomDescription: { type: String,trim: true},
      roomFacilities: { type: [String],default: [] },
      accommodation:{type:mongoose.Schema.Types.ObjectId, ref:"Accommodation"}
    },{
        timestamps:true
    }
  );

  const Room = mongoose.model("Room",roomDetailsSchema)

  export default Room;
