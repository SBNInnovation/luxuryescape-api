import { Request, Response } from "express";
import { deleteFile, uploadFile } from "../../utility/cloudinary.js";
import Recommend from "../../models/recommendedAcco.models/recommended.js";


export interface MulterRequest extends Request {
    file?: Express.Multer.File; // Represents the single file uploaded using multer.single()
  }

const addRecommededAcco = async(req:Request, res:Response):Promise<void> =>{
    try {
        const{
            affiliatedAccommodation,
            link
        } = req.body;
        if(!affiliatedAccommodation){
            res.status(404).json({success:false, message:"Affiliated name is required"})
            return
        }
        const thumbnail = req?.file ||""; 
  
        const uploadedThumbnail = thumbnail
        ? 
        await uploadFile(`${req.file?.path}` || "", "affiliated/images")
        : null;

        const newAffiliated = await Recommend.create({
            affiliatedAccommodation,
            thumbnail:uploadedThumbnail?.secure_url,
            link
        })
        if(!newAffiliated){
            res.status(404).json({success:false, message:"Unable to create the affialiated."})
            return
        }
        res.status(200).json({success:true, message:"Created successfully", data:newAffiliated})

    } catch (error) {
        console.log(error);
        if(error instanceof(Error)){
            res.status(400).json({success:false, message:error.message})
        }
    }
}

const editReccommendedAcco = async (req: Request, res: Response): Promise<void> => {
  try {
    const { affiliatedAccommodation, link } = req.body;
    const { recommendedId } = req.params;

    // Check if recommendedId is provided
    if (!recommendedId) {
       res.status(400).json({ success: false, message: 'recommendedId is required' });
       return
    }

    // Fetch the recommended accommodation by ID
    const existingReccommeded = await Recommend.findById(recommendedId);

    // Check if the accommodation exists
    if (!existingReccommeded) {
       res.status(404).json({ success: false, message: 'Recommended accommodation not found' });
       return
    }

    // Update properties
    existingReccommeded.affiliatedAccommodation = affiliatedAccommodation || existingReccommeded.affiliatedAccommodation;
    existingReccommeded.link = link || existingReccommeded.link;

    // Handle file upload (if any)
    let uploadedThumbnailUrl = existingReccommeded.thumbnail;

    if (req.file) {
      // Upload new thumbnail if file is provided
      const thumbnail = await uploadFile(req.file.path, 'affiliated/images');
      uploadedThumbnailUrl = thumbnail?.secure_url || uploadedThumbnailUrl;

      // Delete old thumbnail from Cloudinary if it's not the same as the new one
      if (existingReccommeded.thumbnail && existingReccommeded.thumbnail !== uploadedThumbnailUrl) {
        await deleteFile(existingReccommeded.thumbnail); // Corrected reference to 'existingReccommeded.thumbnail'
      }
    }

    // Save the updated accommodation
    existingReccommeded.thumbnail = uploadedThumbnailUrl;
    await existingReccommeded.save();

     res.status(200).json({
      success: true,
      message: 'Recommended accommodation updated successfully',
      data: existingReccommeded,
    });

  } catch (error) {
    console.error('Error updating recommended accommodation:', error);
    if(error instanceof(Error)){
        res.status(400).json({success:false, message:error.message})
    }
  }
};

// Delete recommended accommodation
const deleteReccommended = async (req: Request, res: Response): Promise<void> => {
    try {
      const { recommendedId } = req.params;
  
      if (!recommendedId) {
        res.status(400).json({ success: false, message: 'recommendedId is required' });
        return;
      }
  
      const recToDelete = await Recommend.findById(recommendedId);
  
      if (!recToDelete) {
        res.status(404).json({ success: false, message: 'Recommended accommodation not found' });
        return;
      }
  
      // Delete thumbnail from cloudinary if exists
      if (recToDelete.thumbnail) {
        const fileName = recToDelete.thumbnail.split('/').pop();         // abc123.jpg
        const publicId = fileName?.split('.')[0];                 // abc123
        const fullPublicId = `affiliated/images/${publicId}`;       // ✅ with folder
        if (fullPublicId) {
          const deleteResult = await deleteFile(fullPublicId);
          if (!deleteResult) {
            res.status(500).json({ sueccess: false, message: "Failed to delete thumbnail image from Cloudinary" });
            return;
          }
        }
      }
  
      await Recommend.findByIdAndDelete(recommendedId);
  
      res.status(200).json({ success: true, message: 'Recommended accommodation deleted successfully' });
  
    } catch (error) {
      console.error("Error deleting recommended accommodation:", error);
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
      }
    }
  };

  // Get all recommended accommodations
const getAllRecommended = async (req: Request, res: Response): Promise<void> => {
    try {
      const recommendedList = await Recommend.find().sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: recommendedList });
    } catch (error) {
      console.error("Error fetching recommended accommodations:", error);
      if (error instanceof Error) {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  };

// Get a specific recommended accommodation
const getRecommendedById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { recommendedId } = req.params;
  
      if (!recommendedId) {
        res.status(400).json({ success: false, message: 'recommendedId is required' });
        return;
      }
  
      const recommendation = await Recommend.findById(recommendedId);
  
      if (!recommendation) {
        res.status(404).json({ success: false, message: 'Recommended accommodation not found' });
        return;
      }
  
      res.status(200).json({ success: true, data: recommendation });
  
    } catch (error) {
      console.error("Error fetching recommended accommodation:", error);
      if (error instanceof Error) {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  };
  

export {editReccommendedAcco,addRecommededAcco,getAllRecommended,getRecommendedById,deleteReccommended}
