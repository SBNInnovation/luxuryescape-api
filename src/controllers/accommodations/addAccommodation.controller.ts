import { Request, Response } from "express";
import { uploadFile } from "../../utility/cloudinary.js";
import { Express } from "express";
import Accommodation from "../../models/accommodation.models/Accommodation.js";

export interface MulterRequest extends Request {
    files?: {
      accommodationPics?: Express.Multer.File[];
      roomPhotos?: Express.Multer.File[];
    };
  }

const addAccomodation = async(req:MulterRequest, res:Response):Promise<void> =>{
    try {
        const {
            accommodationTitle,
            accommodationLocation,
            accommodationRating,
            accommodationDescription,
            accommodationFeatures,
            accommodationAmenities,
            rooms
        } = req.body;

        if(
            !accommodationTitle ||
            !accommodationLocation ||
            !accommodationRating ||
            !accommodationDescription ||
            !accommodationFeatures ||
            !accommodationAmenities ||
            !rooms
        ){
            res.status(404).json({success:false, message: "Please fill in all fields."});
            return;
        }

        const accommodationPics = req?.files?.accommodationPics || [];
        const roomPhotos = req?.files?.roomPhotos || [];

        const uploadedAccommodationPics = accommodationPics.length
        ? await Promise.all(accommodationPics.map((file) => uploadFile(file?.path || "", "tours/accommodation/images")))
        : [];
        const uploadedRoomPhotos = roomPhotos.length
        ? await Promise.all(roomPhotos.map((file) => uploadFile(file?.path || "", "tours/accommodation/rooms/images")))
        : [];
      
        // const parsedRooms = JSON.parse(rooms)

        const accommodation = await Accommodation.create({
            accommodationTitle,
            accommodationLocation,
            accommodationRating,
            accommodationDescription,
            accommodationFeatures,
            accommodationAmenities,
            // rooms:parsedRooms,
            rooms,
            accommodationPics: uploadedAccommodationPics.map((file) => file?.secure_url) || [],
            roomPhotos: uploadedRoomPhotos.map((file) =>file?.secure_url) || [],
        });

        if(!accommodation){
            res.status(404).json({success:false, message: "Failed to create accommodation."})
            return;
        }
        res.status(201).json({success:true, message: "Accommodation created successfully",accommodation})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message: "Internal Server Error."})
        return
    }
}

export default addAccomodation;