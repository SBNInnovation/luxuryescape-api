import { Request, Response } from "express";
import CustomizeQuote from "../../models/customizeQuote.models/customizeQuote.js";
import TailorMade from "../../models/tailor-made.models/tailor-made.js";
import Agent from "../../models/agent.models/Agent.js";

const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const agentId = req.params.agentId || req.query.agentId;

        if (!agentId) {
            res.status(400).json({ success: false, message: "agentId is required for deletion." });
            return;
        }

        let deletedUser = null;

        // Search and delete from CustomizeQuote
        const quoteUser = await Agent.findOneAndDelete({ _id:agentId });
        if (quoteUser) {
            deletedUser = { schema: "CustomizeQuote", user: quoteUser };
        }

        // // If not found, search and delete from TailorMade
        // if (!deletedUser) {
        //     const tailorMadeUser = await TailorMade.findOneAndDelete({ email });
        //     if (tailorMadeUser) {
        //         deletedUser = { schema: "TailorMade", user: tailorMadeUser };
        //     }
        // }

        // // If not found, search and delete from Agent
        // if (!deletedUser) {
        //     const agentUser = await Agent.findOneAndDelete({ email });
        //     if (agentUser) {
        //         deletedUser = { schema: "Agent", user: agentUser };
        //     }
        // }

        // If no user was deleted, return not found
        if (!deletedUser) {
            res.status(404).json({ success: false, message: "No user found with this email." });
            return;
        }

        res.status(200).json({  
            success: true,
            message: "User deleted successfully",
            deletedFrom: deletedUser.schema,
            deletedUser: deletedUser.user
        });

    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Server error" });
    }
};

export default deleteUser;
