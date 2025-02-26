import { Request, Response } from "express";
import CustomizeQuote from "../../models/customizeQuote.models/customizeQuote.js";


const addCustomizeQuote = async(req:Request, res:Response):Promise<void> =>{
    try {
        const {
            name,
            email,
            number,
            message
        } = req.body;

        if(!name || !email || !number || ! message){
            res.status(400).json({success:false, message: "Please fill all fields."});
            return
        }

        const customizeQuote = await CustomizeQuote.create({
            name,
            email,
            number,
            message
        });
        if(!customizeQuote){
            res.status(400).json({success:false, message: "Failed to add customize."})
            return
        }
        res.status(200).json({success:true, message: "Request added successfully.", data:customizeQuote})
    } catch (error) {
        console.log(error)
        if(error instanceof(Error)){
            res.status(500).json({success:false, message: error.message})
        }
    }
}

export default addCustomizeQuote;