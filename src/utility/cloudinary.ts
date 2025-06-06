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
//     console.log(public_id);
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

// const deleteFile = async (secureUrl: string) => {
//     try {
//       if (!secureUrl) {
//         throw new Error("secureUrl is required")
//       }
  
//       // Extract the public_id
//       const publicId = secureUrl
//         .split("/")
//         .slice(7) // Remove initial URL components
//         .join("/") // Join remaining components
//         .replace(/\.[^/.]+$/, "") // Remove the file extension
  
//       console.log(`Extracted public_id: ${publicId}`)
  
//       const updatedString = publicId.replace(/%20/g, " ")

  
//       // Delete the image using the public_id
//       const result = await cloudinary.uploader.destroy(updatedString)
  
//       if (result.result !== "ok") {
//         throw new Error("Error deleting file")
//       }
  
//       // return result
//     } catch (error) {
//       console.error("Error in deleteImage function:", error)
//       throw error
//     }
//   }

const deleteFile = async (secureUrl: string) => {
    try {
      if (!secureUrl) {
        throw new Error("secureUrl is required")
      }
  
      const publicId = secureUrl
        .split("/")
        .slice(7)
        .join("/")
        .replace(/\.[^/.]+$/, "")
  
      const updatedString = decodeURIComponent(publicId)
  
      const result = await cloudinary.uploader.destroy(updatedString)
  
      if (result.result !== "ok") {
        throw new Error(`Cloudinary deletion failed: ${JSON.stringify(result)}`)
      }
  
    } catch (error) {
      console.error("Error in deleteImage function:", error);
      // Always throw a real Error object
      throw new Error(`Error deleting image: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  

// const deleteFile = async (urlOrPublicId: string) => {
//   try {
//       let publicId = urlOrPublicId;

//       // Handle if full URL is provided
//       if (urlOrPublicId.startsWith("http")) {
//           try {
//               const url = new URL(urlOrPublicId);
              
//               // Extract the path after '/upload/'
//               const uploadPath = url.pathname.split("/upload/")[1];
              
//               if (!uploadPath) {
//                   throw new Error("Could not extract path from URL");
//               }
              
//               // Remove file extension
//               publicId = uploadPath.replace(/\.[^/.]+$/, "");
//           } catch (parseError) {
//               console.error("Error parsing Cloudinary URL:", parseError);
//               throw new Error(`Invalid Cloudinary URL format: ${urlOrPublicId}`);
//           }
//       }

//       const result = await cloudinary.uploader.destroy(publicId);

//       if (!result) {
//           throw new Error("No result from Cloudinary delete operation");
//       }
      
//       if (result.result !== "ok") {
//           throw new Error(`Cloudinary delete failed with status: ${result.result}`);
//       }

//       return result;
//   } catch (error) {
//       console.error("Cloudinary delete error:", error);
//       throw error; // Re-throw to allow proper error handling upstream
//   }
// };
export {uploadFile,deleteFile}