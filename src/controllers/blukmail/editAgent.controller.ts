import { Request, Response } from "express";
import Agent from "../../models/agent.models/Agent.js";


const editAgent = async (req: Request, res: Response): Promise<void> => {
    try {
        const {agentId} = req.params;
        const { name, email, number,country } = req.body;

        const agent = await Agent.findByIdAndUpdate(agentId,{
            $set:{
                name, email, number,country
            }
        },{
            new:true
        });

        if (!agent) {
            res.status(500).json({ success: false, message: "Failed to add customize quote." });
            return;
        }
        res.status(200).json({success:true, message:"Edit successfully", data:agent})
       
    } catch (error) {
        console.error("Error processing quote request:", error);
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Server error" });
    }
};

export default editAgent;
