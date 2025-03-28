import { Request, Response } from "express"
import Trek from "../../models/trek.models/trek.js";

const updateActiveStatus = async(req:Request,res:Response):Promise<void> =>{
    try {
        const {trekId} = req.query;
        const activation =req.body;

             // Validate input
             if (!trekId) {
                res.status(400).json({ success: false, message: "Trek ID is required." });
                return;
            }
    
            if (activation.activation !== "active" && activation.activation !== "inactive") {
                res.status(400).json({ success: false, message: "Invalid activation value. Use 'active' or 'inactive'." });
                return;
            }

        if(activation.activation === "active"){
            const tour = await Trek.findByIdAndUpdate(trekId,{isActivate:true},{new:true});
            if(!tour){
                res.status(404).json({success:false, message:"Trek not found"})
                return
            }
            res.status(200).json({success:true, message:"Activated"});
        }else if(activation.activation === "inactive"){
            const tour = await Trek.findByIdAndUpdate(trekId,{isActivate:false},{new:true});
            if(!tour){
                res.status(404).json({success:false, message:"Trek not found"})
                return
            }
            res.status(200).json({success:true, message:"Deactivated"});
        }
       
    } catch (error) {
        if(error instanceof(Error)){
        res.status(500).json({success:false, message:error.message})
    }
}
}

export default updateActiveStatus;