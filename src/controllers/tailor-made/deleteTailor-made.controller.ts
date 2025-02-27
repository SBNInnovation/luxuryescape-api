import { Request, Response } from "express";
import TailorMade from "../../models/tailor-made.models/tailor-made.js";


const deleteSpecificTailor = async(req:Request, res:Response):Promise<void> =>{
    try {
        const tailorId = req.params.tailorId;
        if(!tailorId){
            res.status(400).json({success:false, message: "Tailor ID is required"});
            return
        }
        const tailorDelete = await TailorMade.findByIdAndDelete(tailorId);
        if(!tailorDelete){
            res.status(404).json({sucess:false, message: "Tailor request not found"});
            return
        }
        res.status(200).json({success:true, message: "Tailor-made request deleted successfully"});
    } catch (error) {
        console.log(error)
    }
}

export default deleteSpecificTailor