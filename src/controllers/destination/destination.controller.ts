// import { Request, Response } from "express";
// import { deleteFile, uploadFile } from "../../utility/cloudinary.js";
// import Destination from "../../models/destination.models/destination.js";
// import slug from "slug";

// export interface MulterRequest extends Request {
//   files?: {
//     image?: Express.Multer.File[];
//   };
// }

// const createDestination = async (req: MulterRequest, res: Response): Promise<void> => {
//   try {
//     const title = req.body.title?.trim();
//     const description = req.body.description?.trim();

//     if (!title || !description) {
//       res.status(400).json({ success: false, message: "Please fill in all fields." });
//       return;
//     }

//     let uploadedImageUrl = "";

//     if (req.files?.image?.[0]) {
//       const uploadedThumbnail = await uploadFile(req.files.image[0].path, "destinations/images");
//       if (uploadedThumbnail?.secure_url) {
//         uploadedImageUrl = uploadedThumbnail.secure_url;
//       } else {
//         res.status(500).json({ success: false, message: "Image upload failed." });
//         return;
//       }
//     }

//     const slugs = slug(title, {
//       lower: true,
//       });

//     const destination = await Destination.create({
//       slug:slugs,
//       title,
//       description,
//       image: uploadedImageUrl,
//     });

//     res.status(201).json({ success: true, data: destination });

//   } catch (error) {
//     console.error("Error in createDestination:", error);
//     res.status(500).json({
//       success: false,
//       message: error instanceof Error ? error.message : "Internal server error",
//     });
//   }
// };


// const getDestinationById = async (req: Request, res: Response): Promise<void> => {
//     try {
//       const { destinationId } = req.params;
  
//       const destination = await Destination.findById(destinationId);
  
//       if (!destination) {
//         res.status(404).json({ success: false, message: "Destination not found." });
//         return;
//       }
  
//       res.status(200).json({ success: true, data: destination });
  
//     } catch (error) {
//       console.error("Error fetching destination:", error);
//       res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Server error" });
//     }
//   };

//   const updateDestination = async (req: MulterRequest, res: Response): Promise<void> => {
//     try {
//       const { destinationId } = req.params;
//       const { title, description, removeImage } = req.body;
  
//       // Find the destination by ID
//       const destination = await Destination.findById(destinationId);
//       if (!destination) {
//         res.status(404).json({ success: false, message: "Destination not found." });
//         return;
//       }
  
//       let updatedImageUrl = destination.image; // Keep the current image URL by default

//       // If image is being removed explicitly
//       if (removeImage&& destination.image) {
//         // Delete the image from Cloudinary
//         await deleteFile(destination.image); // Delete the existing image
//         updatedImageUrl = ""; // Set the image URL to an empty string
//       }
  
//       // If a new image is uploaded, handle the upload and update URL
//       if (req.files?.image?.[0]) {
//         const uploadedImage = await uploadFile(req.files.image[0].path, "destinations/images");
//         if (!uploadedImage?.secure_url) {
//           res.status(500).json({ success: false, message: "Image upload failed." });
//           return;
//         }
//         updatedImageUrl = uploadedImage.secure_url; // Update with the new image URL
//       }
  
//       // Update the other fields
//       destination.title = title?.trim() || destination.title;
//       destination.description = description?.trim() || destination.description;
//       destination.image = updatedImageUrl; // Set the new image URL or keep the old one if no new image was uploaded
//       destination.slug = slug(title,
//         {
//           lower:true
//         }
//       );
//       // Save the updated destination
//       await destination.save();
  
//       res.status(200).json({ success: true, data: destination });
  
//     } catch (error) {
//       console.error("Error updating destination:", error);
//       res.status(500).json({
//         success: false,
//         message: error instanceof Error ? error.message : "Server error",
//       });
//     }
//   };

//   const deleteDestination = async (req: Request, res: Response): Promise<void> => {
//     try {
//       const { destinationId } = req.params;
  
//       const deleted = await Destination.findByIdAndDelete(destinationId);
  
//       if (!deleted) {
//         res.status(404).json({ success: false, message: "Destination not found." });
//         return;
//       }
  
//       res.status(200).json({ success: true, message: "Destination deleted successfully." });
  
//     } catch (error) {
//       console.error("Error deleting destination:", error);
//       res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Server error" });
//     }
//   };
  

//   const getAllDestinations = async (req: Request, res: Response): Promise<void> => {
//     try {
//       // Fetch all destinations from the database
//       const destinations = await Destination.find();
  
//       // Check if no destinations were found
//       if (destinations.length === 0) {
//         res.status(404).json({ success: false, message: "No destinations found." });
//         return;
//       }
  
//       res.status(200).json({ success: true, data: destinations });
//     } catch (error) {
//       console.error("Error fetching all destinations:", error);
//       res.status(500).json({
//         success: false,
//         message: error instanceof Error ? error.message : "Server error",
//       });
//     }
//   };
  
  
  
// export { createDestination,
//     updateDestination,
//     deleteDestination,
//     getDestinationById,
//     getAllDestinations
//  };





import { Request, Response } from "express";
import { deleteFile, uploadFile } from "../../utility/cloudinary.js";
import Destination from "../../models/destination.models/destination.js";
import slug from "slug";

export interface MulterRequest extends Request {
  files?: {
    image?: Express.Multer.File[];
  };
}

const createDestination = async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    const title = req.body.title?.trim();
    const description = req.body.description?.trim();

    if (!title || !description) {
      res.status(400).json({ success: false, message: "Please fill in all fields." });
      return
    }

    let uploadedImageUrl = "";

    if (req.files?.image?.[0]) {
      const uploadedThumbnail = await uploadFile(req.files.image[0].path, "destinations/images");
      if (uploadedThumbnail?.secure_url) {
        uploadedImageUrl = uploadedThumbnail.secure_url;
      } else {
        res.status(500).json({ success: false, message: "Image upload failed." });
      }
    }

    const destinationSlug = slug(title, { lower: true });

    const destination = await Destination.create({
      slug: destinationSlug,
      title,
      description,
      image: uploadedImageUrl,
    });

    res.status(201).json({ success: true, data: destination });

  } catch (error) {
    console.error("Error in createDestination:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const getDestinationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { destinationId } = req.params;

    const destination = await Destination.findById(destinationId);

    if (!destination) {
      res.status(404).json({ success: false, message: "Destination not found." });
      return
    }

    res.status(200).json({ success: true, data: destination });

  } catch (error) {
    console.error("Error fetching destination:", error);
    res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Server error" });
  }
};

const updateDestination = async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    const { destinationId } = req.params;
    const { title, description, removeImage } = req.body;

    const destination = await Destination.findById(destinationId);
    if (!destination) {
      res.status(404).json({ success: false, message: "Destination not found." });
      return;
    }

    // Initial image URL
    let updatedImageUrl = destination.image;

    // 🗑️ If user requests to remove image
    if (removeImage === "true" && destination.image) {
      await deleteFile(destination.image); // Remove from Cloudinary
      updatedImageUrl = ""; // Clear image
    }

    // 🆕 If new image is uploaded (overwrite previous image)
    if (req.files?.image?.[0]) {
      // 🔁 If there's an old image, delete it first
      if (updatedImageUrl) {
        await deleteFile(updatedImageUrl);
      }

      const uploadedImage = await uploadFile(req.files.image[0].path, "destinations/images");
      if (!uploadedImage?.secure_url) {
        res.status(500).json({ success: false, message: "Image upload failed." });
        return;
      }
      updatedImageUrl = uploadedImage.secure_url; // New image URL
    }

    // 🔄 Update the rest
    destination.title = title?.trim() || destination.title;
    destination.description = description?.trim() || destination.description;
    destination.image = updatedImageUrl;
    destination.slug = slug(title?.trim() || destination.title, { lower: true });

    await destination.save();

    res.status(200).json({ success: true, data: destination });

  } catch (error) {
    console.error("Error updating destination:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server error",
    });
  }
};


const deleteDestination = async (req: Request, res: Response): Promise<void> => {
  try {
    const { destinationId } = req.params;

    const deleted = await Destination.findByIdAndDelete(destinationId);

    if (!deleted) {
      res.status(404).json({ success: false, message: "Destination not found." });
      return
    }

    res.status(200).json({ success: true, message: "Destination deleted successfully." });

  } catch (error) {
    console.error("Error deleting destination:", error);
    res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Server error" });
  }
};

const getAllDestinations = async (req: Request, res: Response): Promise<void> => {
  try {
    const page: number = parseInt(req.query.page as string, 10) || 1;
    const limit: number = parseInt(req.query.limit as string, 10) || 10;
    const search = req.query.search ? req.query.search.toString().trim().toLowerCase() : "";

     // Validate pagination values
     if (page < 1 || limit < 1) {
      res.status(400).json({ success: false, message: "Invalid page or limit value." });
      return;
  }

  // Calculate documents to skip
  const skip = (page - 1) * limit;

  // Build query object
  let query: any = {};
  
  if (search) {
    query.$or = [
        { title: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" }}
    ];
}
    const destinations = await Destination.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    ;

    if (destinations.length === 0) {
      res.status(404).json({ success: false, message: "No destinations found." });
      return
    }

    res.status(200).json({ success: true, data: destinations });

  } catch (error) {
    console.error("Error fetching all destinations:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server error",
    });
  }
};

export { createDestination, updateDestination, deleteDestination, getDestinationById, getAllDestinations };
