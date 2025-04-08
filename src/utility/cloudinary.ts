import {v2 as cloudinary} from 'cloudinary'; 
import dotenv from "dotenv"

dotenv.config()

//Middlewares <<

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});
console.log("Cloudinary Env Variables:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

if(!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('Cloudinary config not found');
    process.exit(1);
}

const uploadFile = async (file:string,folder:string) => {
    try {
        const uploadResult = await cloudinary.uploader.upload(file, {
            folder:`/LuxuryEscape/${folder}`
        });
        if(!uploadResult) {
            throw new Error('Error uploading file');
        }
        // console.log(uploadResult);
        return uploadResult;
    } catch (error) {
        console.log("Error on cloudinary :",error);
    }
}

// delete file
// const deleteFile = async (public_id:string) => {
//     // console.log(public_id);
//     try {
//         const result = await cloudinary.uploader.destroy(public_id);
//         if (!result) {
//             throw new Error('Error deleting file');
//         }
//         // console.log(result);
//         return result;
//     } catch (error) {
//         console.log("Error on cloudinary:", error);
//     }
// }

const deleteFile = async (urlOrPublicId: string) => {
    try {
      let publicId = urlOrPublicId;
  
      // Handle if full URL is provided
      if (urlOrPublicId.startsWith("http")) {
        const url = new URL(urlOrPublicId);
        const pathParts = url.pathname.split("/");
  
        // Get index of "upload"
        const uploadIndex = pathParts.findIndex(part => part === "upload");
  
        // Extract public ID parts (after "upload")
        const publicIdParts = pathParts.slice(uploadIndex + 1);
  
        // Remove file extension from the last segment
        const fileName = publicIdParts.pop() || "";
        const fileNameWithoutExt = fileName.split(".")[0];
  
        // Recombine the full path without extension
        publicId = [...publicIdParts, fileNameWithoutExt].join("/");
      }
  
      const result = await cloudinary.uploader.destroy(publicId);
  
      if (!result || result.result !== "ok") {
        throw new Error("Error deleting file");
      }
  
      return result;
    } catch (error) {
      console.error("Cloudinary delete error:", error);
    }
  };
  


export{uploadFile,deleteFile}