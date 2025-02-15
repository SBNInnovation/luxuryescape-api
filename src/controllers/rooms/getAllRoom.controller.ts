import { Request, Response } from "express";
import Room from "../../models/rooms.models/room.js";

const getAllRoom = async(req:Request,res:Response):Promise<void> =>{
    try {
        const getRoom = await Room.find({}).populate("accommodation");
        if(!getRoom){
            res.status(404).json({success:false, message:"No rooms found"});
            return;
        }
        res.status(200).json({success:true,message:"all room fetched", data:getRoom});
    } catch (error) {
        console.log(error)
        if(error instanceof Error){
            res.status(500).json({success:false,message:error.message});
        }
    }
}

export default getAllRoom;