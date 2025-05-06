import { Request, Response } from "express";

import Destination from "../../models/destination.models/destination.js";
import slug from "slug";
import { deleteFile, uploadFile } from "../../utility/cloudinary.js";
import Recommend from "../../models/recommendedAcco.models/recommended.js";
import Accommodation from "../../models/accommodation.models/Accommodation.js";

export interface MulterRequest extends Request {
  files?: {
    thumbnail?: Express.Multer.File[];
    image?: Express.Multer.File[];
  };
}

const createDestination = async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    const {title,description,caption} = req.body;

    console.log(req.body)

    if (!title || !description) {
      res.status(400).json({ success: false, message: "Please fill in all fields." });
      return
    }

    let parsedCaption: string[] = [];
    if (caption) {
      try {
        parsedCaption = JSON.parse(caption);
      } catch (e) {
        res.status(400).json({ success: false, message: "Invalid caption format. Must be a valid JSON array." });
        return;
      }

      if (!Array.isArray(parsedCaption)) {
        res.status(400).json({ success: false, message: "Caption must be an array." });
        return;
      }
    }

    let uploadedThumbnailUrl = "";

    if (req.files?.thumbnail?.[0]) {
      const uploadedThumbnail = await uploadFile(req.files.thumbnail[0].path, "destinations/thumbnail");
      if (uploadedThumbnail?.secure_url) {
        uploadedThumbnailUrl = uploadedThumbnail.secure_url;
      } else {
        res.status(500).json({ success: false, message: "Image upload failed." });
      }
    }

    const image = req.files?.image || [];

    if (parsedCaption.length !== image.length) {
      res.status(400).json({ success: false, message: "Number of captions and images must match" });
      return
    }
    
    const uploadedImage = image.length?
    await Promise.all(image.map((file)=> uploadFile(file.path || "", "destinations/images")))
    :[];

    const uploadedImageUrl = uploadedImage.map((file)=> file?.secure_url)

    const destinationSlug = slug(title, { lower: true });

    const relatedDestinations = parsedCaption.map((caption: string, index: number) => ({
      caption,
      image: uploadedImageUrl[index] || ""
    }));
    
    const destination = await Destination.create({
      slug: destinationSlug,
      title,
      description,
      thumbnail: uploadedThumbnailUrl,
      destinations: relatedDestinations
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

// const updateDestination = async (req: MulterRequest, res: Response): Promise<void> => {
//   try {
//     const { destinationId } = req.params;
//     const { title, description, removeThumbnail } = req.body;

//     const destination = await Destination.findById(destinationId);
//     if (!destination) {
//       res.status(404).json({ success: false, message: "Destination not found." });
//       return;
//     }

//     // Initial image URL
//     let updatedThumbnailUrl = destination.thumbnail;

//     // 🗑️ If user requests to remove image
//     if (removeThumbnail === "true" && destination.thumbnail) {
//       await deleteFile(destination.thumbnail); // Remove from Cloudinary
//       updatedThumbnailUrl = ""; // Clear image
//     }

//     // 🆕 If new image is uploaded (overwrite previous image)
//     if (req.files?.thumbnail?.[0]) {
//       // 🔁 If there's an old image, delete it first
//       if (updatedThumbnailUrl) {
//         await deleteFile(updatedThumbnailUrl);
//       }

//       const uploadedImage = await uploadFile(req.files.thumbnail[0].path, "destinations/images");
//       if (!uploadedImage?.secure_url) {
//         res.status(500).json({ success: false, message: "Image upload failed." });
//         return;
//       }
//       updatedThumbnailUrl = uploadedImage.secure_url; // New image URL
//     }

//     // 🔄 Update the rest
//     destination.title = title?.trim() || destination.title;
//     destination.description = description?.trim() || destination.description;
//     destination.thumbnail = updatedThumbnailUrl;
//     destination.slug = slug(title?.trim() || destination.title, { lower: true });

//     await destination.save();

//     res.status(200).json({ success: true, data: destination });

//   } catch (error) {
//     console.error("Error updating destination:", error);
//     res.status(500).json({
//       success: false,
//       message: error instanceof Error ? error.message : "Server error",
//     });
//   }
// };

// const updateDestination = async (req: MulterRequest, res: Response): Promise<void> => {
//   try {
//     const { destinationId } = req.params;

//     const title = req.body.title?.trim();
//     const description = req.body.description?.trim();
//     const removeCaptions = req.body.removeCaptions ? JSON.parse(req.body.removeCaptions) : [];
//     const newCaptions = req.body.caption ? JSON.parse(req.body.caption) : [];

//     const destination = await Destination.findById(destinationId);
//     if (!destination) {
//       res.status(404).json({ success: false, message: "Destination not found." });
//       return
//     }

//     // Update title/description
//     if (title) {
//       destination.title = title;
//       destination.slug = slug(title, { lower: true });
//     }
//     if (description) {
//       destination.description = description;
//     }

//     // Update thumbnail if new one is uploaded
//     if (req.files?.thumbnail?.[0]) {
//       const uploadedThumb = await uploadFile(req.files.thumbnail[0].path, "destinations/thumbnail");
    
//       if (uploadedThumb?.secure_url) {
//         // 👇 Delete old thumbnail from Cloudinary
//         if (destination.thumbnail) {
//           await deleteFile(destination.thumbnail);
//         }
    
//         // Update thumbnail
//         destination.thumbnail = uploadedThumb.secure_url;
//       }
//     }
    
//     if (removeCaptions.length) {
//       //  Get destinations that need to be deleted
//       const toDelete = destination.destinations.filter(dest =>
//         removeCaptions.includes(dest.caption)
//       );
    
//       // Remove them from the array
//       destination.set(
//         'destinations',
//         destination.destinations.filter(dest =>
//           !removeCaptions.includes(dest.caption)
//         )
//       );
    
//       // Extract public_ids from image URLs
//       const publicIds = toDelete
//         .map(dest => {
//           const parts = dest.image?.split("/") || [];
//           const fileName = parts[parts.length - 1]; // abc123.jpg
//           const [publicId] = fileName.split(".");   // abc123
//           return `destinations/images/${publicId}`;
//         })
//         .filter(Boolean);
    
//       // Delete from Cloudinary
//       await Promise.all(publicIds.map(id => deleteFile(id)));
//     }
    
//     // Add new captions + images (if any)
//     const imageFiles = req.files?.image || [];

//     if (newCaptions.length && imageFiles.length) {
//       if (newCaptions.length !== imageFiles.length) {
//         res.status(400).json({ success: false, message: "Number of captions and images must match." });
//         return
//       }

//       const uploadedImages = await Promise.all(
//         imageFiles.map((file) => uploadFile(file.path, "destinations/gallery/images"))
//       );

//       const newDestinations = newCaptions.map((caption: string, index: number) => ({
//         caption,
//         image: uploadedImages[index]?.secure_url || ""
//       }));

//       destination.destinations.push(...newDestinations);
//     }
//     // Save changes
//     await destination.save();

//     res.status(200).json({ success: true, data: destination });

//   } catch (error) {
//     console.error("Error in editDestination:", error);
//     res.status(500).json({
//       success: false,
//       message: error instanceof Error ? error.message : "Internal server error",
//     });
//   }
// };

const updateDestination = async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    const { destinationId } = req.params;

    const title = req.body.title?.trim();
    const description = req.body.description?.trim();
    const removeCaptions = req.body.removeCaptions ? JSON.parse(req.body.removeCaptions) : [];
    const newCaptions = req.body.caption ? JSON.parse(req.body.caption) : [];

    const destination = await Destination.findById(destinationId);
    if (!destination) {
      res.status(404).json({ success: false, message: "Destination not found." });
      return;
    }

    // Update title/description
    if (title) {
      destination.title = title;
      destination.slug = slug(title, { lower: true });
    }
    if (description) {
      destination.description = description;
    }

    // Update thumbnail if new one is uploaded
    if (req.files?.thumbnail?.[0]) {
      const uploadedThumb = await uploadFile(req.files.thumbnail[0].path, "destinations/thumbnail");

      if (uploadedThumb?.secure_url) {
        if (destination.thumbnail) {
          await deleteFile(destination.thumbnail); // ✅ Use full secure_url
        }
        destination.thumbnail = uploadedThumb.secure_url;
      }
    }

    // Remove specified images/captions
    if (removeCaptions.length) {
      const toDelete = destination.destinations.filter(dest =>
        removeCaptions.includes(dest.caption)
      );

      // Remove matching destinations
      destination.set(
        'destinations',
        destination.destinations.filter(dest =>
          !removeCaptions.includes(dest.caption)
        )
      );

      // Get full secure_urls for deletion
      const urlsToDelete = toDelete
        .map(dest => dest.image)
        .filter((url): url is string => Boolean(url));

      await Promise.all(urlsToDelete.map(url => deleteFile(url))); // ✅ send full URL
    }

    // Add new captions and images
    const imageFiles = req.files?.image || [];
    if (newCaptions.length && imageFiles.length) {
      if (newCaptions.length !== imageFiles.length) {
        res.status(400).json({ success: false, message: "Number of captions and images must match." });
        return;
      }

      const uploadedImages = await Promise.all(
        imageFiles.map((file) => uploadFile(file.path, "destinations/gallery/images"))
      );

      const newDestinations = newCaptions.map((caption: string, index: number) => ({
        caption,
        image: uploadedImages[index]?.secure_url || ""
      }));

      destination.destinations.push(...newDestinations);
    }

    await destination.save();

    res.status(200).json({ success: true, data: destination });

  } catch (error) {
    console.error("Error in editDestination:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};


const deleteDestination = async (req: Request, res: Response): Promise<void> => {
  try {
    const { destinationId } = req.params;

    const deleted = await Destination.findByIdAndDelete(destinationId);

    if (!deleted) {
      res.status(404).json({ success: false, message: "Destination not found." });
      return;
    }

    // ✅ Delete thumbnail from Cloudinary
    if (deleted.thumbnail) {
      await deleteFile(deleted.thumbnail)
    }

    // ✅ Delete all destination images
    if (deleted.destinations && Array.isArray(deleted.destinations)) {
      await Promise.all(deleted.destinations.map(async (destination) => {
        if (destination.image) {
          await deleteFile(destination.image);
        }
      }));
    }
        // Remove references from recommended acco
        await Recommend.updateMany({ destination: destinationId }, { $pull: { destination: destinationId }});
    
        // Remove references from Accommodation
        await Accommodation.updateMany({ destination: destinationId }, { $pull: { destination: destinationId }});
    
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
    .sort({ createdAt: -1 });

    if (destinations.length === 0) {
      res.status(404).json({ success: false, message: "No destinations found." });
      return
    }
    const total = await Destination.countDocuments(query);

    res.status(200).json({ success: true, data: {
      destinations, 
      pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
  } }});

  } catch (error) {
    console.error("Error fetching all destinations:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server error",
    });
  }
};

export { createDestination, updateDestination, deleteDestination, getDestinationById, getAllDestinations };
