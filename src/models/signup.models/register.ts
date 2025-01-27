import { Schema } from "mongoose";
import mongoose from "mongoose";

const registerUser = new Schema({
    name: {type:String, required:true},
    email: { type: String, 
        required: true, 
        unique: true, 
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/},
    phone: {type:String, required:true, match:/^\d{10}$/},
    password: {type: String, 
        required: true,
        minlength: 6 },
    otp: {type:String, default:""}
},{
    timestamps:true
})

const Register = mongoose.model("Register",registerUser)

export default Register;