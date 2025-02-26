import { Request, Response } from "express";
import CustomizeQuote from "../../models/customizeQuote.models/customizeQuote.js";

const getSpecificQuote = async(req:Request, res:Response):Promise<void> =>{
    try {
        const {quoteId} = req.params;
        const quote = await CustomizeQuote.findById(quoteId).exec();
        if(!quote){
            res.status(404).json({success:false, message: "Quote not found"});
            return
        }
        quote.status = "viewed"
        await quote.save();
        res.status(200).json({success:true, data:quote});
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, message: "Internal Server Error"});
        return
    }
}

export default getSpecificQuote