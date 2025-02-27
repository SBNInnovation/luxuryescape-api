import { Request, Response } from "express";
import TailorMade from "../../models/tailor-made.models/tailor-made.js";

const getAllTailorRequest = async(req:Request, res:Response):Promise<void> =>{
    try {
        const getAll = await TailorMade.find({}).sort({ createdAt: -1 }) 
        if(!getAll){
            res.status(404).json({success:false, message:"Unable to get the data"})
            return
        }
        res.status(200).json({success:true, message:"all tailoer made request", data:getAll})
    } catch (error) {
        console.log(error)
        if(error instanceof(Error)){
            res.status(500).json({success:false, message:error.message})
        }
    }
}

export default getAllTailorRequest