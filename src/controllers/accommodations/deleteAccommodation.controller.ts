import { Request, Response } from "express";
import Accommodation from "../../models/accommodation.models/Accommodation.js";

const deleteAccommodation = async(req:Request, res:Response):Promise<void> =>{
    try {
        const accommodationId = req.params.accommodationId;
        if(!accommodationId){
            res.status(400).json({success:false, message: "Accommodation ID is required"});
            return
        }

        const deleteAcco = await Accommodation.findByIdAndDelete(accommodationId);
        if(!deleteAcco){
            res.status(404).json({success:false, message: "Accommodation not found"})
            return
        }
        res.status(200).json({success:true, message: "Accommodation deleted successfully"})

    } catch (error) {
        console.log(error)
        if(error instanceof(Error)){
            res.status(500).json({success:false, message: error.message})
            return
        }
    }
}

export default deleteAccommodation;