import { Request, Response } from "express";
import Room from "../../models/rooms.models/room.js";



const deleteRoom = async(req:Request, res:Response):Promise<void> =>{
    try {
        const roomId = req.params.roomId;
        if(!roomId){
            res.status(400).json({success:false, message: "Room ID is required"});
            return
        }

        const deleteRoom = await Room.findByIdAndDelete(roomId);
        if(!deleteRoom){
            res.status(404).json({success:false, message: "Room not found"})
            return
        }
        res.status(200).json({success:true, message: "Room deleted successfully"})

    } catch (error) {
        console.log(error)
        if(error instanceof(Error)){
            res.status(500).json({success:false, message: error.message})
            return
        }
    }
}

export default deleteRoom;