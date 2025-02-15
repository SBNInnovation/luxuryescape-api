import { Request, Response } from "express";
import { Express } from "express";
import { uploadFile } from "../../utility/cloudinary.js";
import Room from "../../models/rooms.models/room.js";

export interface MulterRequest extends Request {
    files?: {
      roomPhotos?: Express.Multer.File[];
    };
  }

const addRoom = async(req:MulterRequest,res:Response):Promise<void> =>{
    try {
        const {
            roomTitle,
            roomStandard,
            roomDescription,
            roomFacilities,
            accommodation
        } = req.body;

        if(!roomTitle ||
            !roomStandard ||
            !roomDescription ||
            !roomFacilities ||
            !accommodation){
                res.status(400).json({success:false, message:"Please fill in all fields"});
                return;
            }

            const parsedFacilites = typeof roomFacilities === "string" ? JSON.parse(roomFacilities) : roomFacilities || []; 
        
        const roomPhotos = req?.files?.roomPhotos || [];

        const uploadedRoomPhotos = roomPhotos.length
            ? await Promise.all(
                roomPhotos.map(async (file) => {
                    try {
                    const uploaded = await uploadFile(file?.path || "", "tours/accommodation/rooms/images");
                    return uploaded?.secure_url || null;
                    } catch (error) {
                    console.error("Error uploading room photo:", error);
                    return null;
                    }
                })
                )
            : [];

        const filteredRoomPhotos = uploadedRoomPhotos.filter((url) => url !== null);

        // Generate slug from title
         const slug = roomTitle.toLowerCase().replace(/\s+/g, "-");

         const  checkExistingRoom = await Room.findOne({roomTitle:roomTitle});
         if(checkExistingRoom){
            res.status(400).json({success:false, message:"Room already exists"});
            return;
        }
        
         const createRoom = await Room.create({
            roomTitle,
            slug,
            roomStandard,
            roomDescription,
            roomFacilities: parsedFacilites,
            accommodation,
            roomPhotos: filteredRoomPhotos
        });

        if(!createRoom){
            res.status(400).json({success:false, message:"Failed to create room"});
            return;
        }
        res.status(200).json({success:true, message:"Room added successfully",data:createRoom})

    } catch (error) {
        console.log(error)
        if(error instanceof Error){
            res.status(500).json({success:false, message:error.message})
        }    
    }
}

export default addRoom;