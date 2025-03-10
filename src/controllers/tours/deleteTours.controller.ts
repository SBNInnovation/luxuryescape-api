import { Request, Response } from "express";
import Tour from "../../models/tours.models/tours";


const deleteTours = async(req:Request, res:Response)=>{
    try {
        const {tourId} = req.params;
        if(!tourId){
            res.status(404).json({success:false, message: "Activation data is required"});
            return;
        }
        const checkTour = await Tour.findById(tourId)
        if(!checkTour){
            res.status(404).json({success:false, message: "Tour not found"});
            return;
        }
        const deleteTour = await Tour.findByIdAndDelete(tourId);
        if(!deleteTour){
            res.status(404).json({success:false, message: "Unable to update"});
            return
        }
        res.status(200).json({success:true, message:"deleted the tour successfully"})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, message:"Internal server error"})
    }
}

export default deleteTours;