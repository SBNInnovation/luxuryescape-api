import { Request, Response } from "express";
import Agent from "../../models/agent.models/Agent.js";


const addAgent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, number,country, company , address} = req.body;

        if (!name || !email || !number || !country || !company || !address) {
            res.status(400).json({ success: false, message: "Please fill all required fields." });
            return;
        }

        let lower = country.toLowerCase();
        let lowerAddress = address.toLowerCase();

        const checkUser = await Agent.find({email})
        if(checkUser.length > 0){
            res.status(400).json({ success: false, message: "Email already exists." });
            return;
            
        }

        const agent = await Agent.create({
            name,
            email,
            number,
            country:lower,
            company,
            address:lowerAddress
        });

        if (!agent) {
            res.status(500).json({ success: false, message: "Failed to add customize quote." });
            return;
        }
        res.status(200).json({success:true, message:"Added user successfully", data:agent})
       
    } catch (error) {
        console.error("Error processing quote request:", error);
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Server error" });
    }
};

export default addAgent;
