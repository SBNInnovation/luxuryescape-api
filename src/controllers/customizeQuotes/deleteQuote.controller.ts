import { Request, Response } from "express";
import CustomizeQuote from "../../models/customizeQuote.models/customizeQuote.js";

const deleteSpecificQuote = async(req:Request, res:Response):Promise<void> =>{
    try {
        const quoteId = req.params.quoteId;
        if(!quoteId){
            res.status(400).json({success:false, message: "Quote ID is required"});
            return
        }
        const quoteDelete = await CustomizeQuote.findByIdAndDelete(quoteId);
        if(!quoteDelete){
            res.status(404).json({sucess:false, message: "Quote not found"});
            return
        }
        res.status(200).json({success:true, message: "Quote deleted successfully"});
    } catch (error) {
        console.log(error)
    }
}

export default deleteSpecificQuote