import { Schema } from "mongoose";
import mongoose from "mongoose";

const tailorMadeSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"] 
    },
    phone: { 
        type: String, 
        required: true, 
    },
    country: { type: String, required: true },
    dreamDestination: { type: [String], default: [] },
    fixedDates: {
        arrival: { type: Date, default: null },
        departure: { type: Date, default: null }
    },
    flexibleDates: {
        preferredMonth: { type: String, default: "" },
        approximateDays: { type: Number, default: 0 }
    },
    travelDuration: { type: Number, default: 0 },
    travelers: {
        adults: { type: Number, default: 0 },
        children: { type: Number, default: 0 }
    },
    experienceLevel: { type: String, required: true },
    hotelStandard: { type: String, enum: ["4 Star", "5 Star", "Above 5 Star"], required: true },
    hotelBrandPreference: { type: String, default: "" },
    transportationPreferences: { type: [String], default: [] },
    mealPreferences: { type: String },
    budget: { type: String, required: true },
    dreamExperience: { type: String, default: "" },
    status:{type:String, default:"pending"}
},{
    timestamps:true
});

const TailorMade = mongoose.model("TailorMade", tailorMadeSchema);

export default TailorMade;
