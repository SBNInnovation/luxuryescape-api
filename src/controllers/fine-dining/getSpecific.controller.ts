import { Request, Response } from "express";
import FineDining from "../../models/fine-dining.models/fine-dining.js";


const getSpecificFineDining = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug;

    if (!slug) {
      res.status(400).json({ success: false, message: "Slug is required" });
      return;
    }

    const fineDining = await FineDining.findOne({ slug });

    if (!fineDining) {
      res.status(404).json({ success: false, message: "Fine Dining not found" });
      return;
    }

    res.status(200).json({ success: true, message: "Fetched successfully", data: fineDining });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong"
    });
  }
};

export default getSpecificFineDining;
