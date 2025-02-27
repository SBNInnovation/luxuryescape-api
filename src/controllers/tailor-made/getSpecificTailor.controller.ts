import { Request, Response } from "express";
import TailorMade from "../../models/tailor-made.models/tailor-made.js";


const getSpecificTailor = async(req:Request, res:Response):Promise<void> =>{
    try {
        const {tailorId} = req.params;
        const tailorMade = await TailorMade.findById(tailorId).exec();
        if(!tailorMade){
            res.status(404).json({success:false, message: "tailorMade not found"});
            return
        }
        tailorMade.status = "viewed"
        await tailorMade.save();
        res.status(200).json({success:true, data:tailorMade});
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, message: "Internal Server Error"});
        return
    }
}

export default getSpecificTailor