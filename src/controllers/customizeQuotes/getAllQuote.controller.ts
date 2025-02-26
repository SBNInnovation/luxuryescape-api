import { Request, Response } from "express";
import CustomizeQuote from "../../models/customizeQuote.models/customizeQuote.js";

const getAllQuote = async(req:Request, res:Response) =>{
    try {
        const quotes = await CustomizeQuote.find({});
        if(!quotes){
            res.status(404).json({success:false, message: "No quotes found"});
            return
        }

        res.status(200).json({success:true, data:quotes});

    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message: "Internal Server Error"});
        return
    }
}

export default getAllQuote;