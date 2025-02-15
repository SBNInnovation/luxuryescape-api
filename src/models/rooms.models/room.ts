import { Schema } from "mongoose";
import mongoose from "mongoose";

const roomDetailsSchema = new Schema(
    {
      roomTitle: { type: String, required: true, trim: true }, //removes leading and trailing whitespace from a string field before saving it to the database.
      slug: { type: String, required: true, unique: true, lowercase: true },
      roomPhotos: { type: [String], default: [] },
      roomStandard: { type: String, required: true, trim: true },
      roomDescription: { type: String, required: true, trim: true, minLength: 10 },
      roomFacilities: { type: [String], required: true, default: [] },
      accommodation:{type:mongoose.Schema.Types.ObjectId, ref:"Accommodation"}
    },{
        timestamps:true
    }
  );

  const Room = mongoose.model("Room",roomDetailsSchema)

  export default Room;
