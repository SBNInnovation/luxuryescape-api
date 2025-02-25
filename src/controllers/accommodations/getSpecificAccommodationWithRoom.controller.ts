import { Request, Response } from "express";
import Accommodation from "../../models/accommodation.models/Accommodation.js";

const getSpecificAccommodation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    // Find accommodation by slug and populate related rooms
    const accommodation = await Accommodation.aggregate([
      {
        $match: { slug }, // Match accommodation by slug (string)
      },
      {
        $lookup: {
          from: "rooms", // Collection name for rooms
          localField: "_id",
          foreignField: "accommodation",
          as: "rooms",
        },
      },
    ]);

    // If no accommodation is found
    if (!accommodation || accommodation.length === 0) {
      res.status(404).json({ success: false, message: "Accommodation not found" });
      return;
    }

    res.status(200).json({ success: true, data: accommodation[0] });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }
};

export default getSpecificAccommodation;


// import { Request, Response } from "express";
// import Accommodation from "../../models/accommodation.models/Accommodation.js";
// import Room from "../../models/rooms.models/room.js";

// const getSpecificAccommodation = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { slug } = req.params;

//     console.log("Received slug:", slug); // Debugging log

//     // Find accommodation by slug
//     const accommodation = await Accommodation.findOne({ slug:slug });

//     if (!accommodation) {
//       res.status(404).json({ success: false, message: "Accommodation not found" });
//       return;
//     }

//     console.log("Accommodation found:", accommodation);

//     // Fetch related rooms
//     const rooms = await Room.find({ accommodation: accommodation._id });

//     res.status(200).json({ 
//       success: true, 
//       data: {accommodation, rooms }
//     });
//   } catch (error) {
//     console.error("Error fetching accommodation:", error);
//     if (error instanceof Error) {
//       res.status(500).json({ success: false, message: "Server error", error: error.message });
//     }
//   }
// };

// export default getSpecificAccommodation;


