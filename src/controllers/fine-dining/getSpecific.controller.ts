import { Request, Response } from "express";
import FineDining from "../../models/fine-dining.models/fine-dining.js";


const getSpecificFineDining = async(req:Request,res:Response):Promise<void> =>{
    try {
        const fineDiningId = req.params.fineDiningId;
        if(!fineDiningId){
            res.status(400).json({success:false, message:"ID is required"});
            return
        }
        const accommodation = await FineDining.findById(fineDiningId);
        if(!accommodation){
            res.status(404).json({success:false, message:"Fine Dining not found"})
            return
        }
        res.status(200).json({success:true, message:"fetched",data:accommodation})
    } catch (error) {
        console.log(error);
        if(error instanceof(Error)){
            res.status(500).json({success:false, message:error.message})
            return
        }
    }
}

export default getSpecificFineDining;