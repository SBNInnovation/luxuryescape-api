import { Request, Response } from "express";
import FineDining from "../../models/fine-dining.models/fine-dining.js";

const makeFeaturedFineDining = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fineDiningId } = req.params;
    const isfeatureParam = req.query.isfeature?.toString().trim().toLowerCase();

    if (isfeatureParam !== "true" && isfeatureParam !== "false") {
      res.status(400).json({ success: false, message: "Invalid value for isfeature. Use 'true' or 'false'." });
      return;
    }

    const isFeature = isfeatureParam === "true";

    const updatedAcco = await FineDining.findByIdAndUpdate(
      fineDiningId,
      { $set: { isFeature } }, 
      { new: true }
    );

    if (!updatedAcco) {
      res.status(404).json({ success: false, message: "Accommodation not found" });
      return;
    }

    res.status(200).json({ success: true, message: "Updated successfully", data: updatedAcco });

  } catch (error) {
    res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Server Error" });
  }
};

export default makeFeaturedFineDining;
