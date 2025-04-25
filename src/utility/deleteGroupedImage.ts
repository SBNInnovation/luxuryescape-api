// import { deleteFile } from "./cloudinary.js";

import { deleteFile } from "./cloudinary.js";

// // Utility function to delete multiple images with correct path
// const deleteImageGroup = async (images: string[], folder: string): Promise<boolean> => {
//     for (const image of images) {
//       const fileName = image.split('/').pop();         // abc123.jpg
//       const publicId = fileName?.split('.')[0];        // abc123
//       if (publicId) {
//         const fullPublicId = `${folder}/${publicId}`;  // tours/gallery/abc123
//         const deleteResult = await deleteFile(fullPublicId);
//         if (!deleteResult) {
//           return false;
//         }
//       }
//     }
//     return true;
//   };
  
//   export default deleteImageGroup

const deleteImageGroup = async (images: string[], folder: string): Promise<boolean> => {
  let allSuccess = true;
  for (const image of images) {
    try {
      const fileName = image.split('/').pop();
      const publicId = fileName?.split('.')[0];
      if (publicId) {
        const fullPublicId = `${folder}/${publicId}`;
        const result = await deleteFile(fullPublicId);
        if (!result) allSuccess = false;
      }
    } catch {
      allSuccess = false;
    }
  }
  return allSuccess;
};

export default deleteImageGroup
