import { Request, Response } from "express";
import Register from "../../models/signup.models/register";
import bcrypt from "bcryptjs";

const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, phone, password } = req.body;

        // Validation for missing fields
        if (!name || !email || !phone || !password) {
            res.status(400).json({
                success: false,
                message: "Please fill all the fields",
            });
            return;
        }

        // Check if the user already exists
        const existingUser = await Register.findOne({ email });
        if (existingUser) {
            res.status(409).json({
                success: false,
                message: "User already exists with this email",
            });
            return;
        }

        // Generate salt and hash password
        const salt = await bcrypt.genSalt(10); // Ensure await is used
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = await Register.create({
            name,
            email,
            phone,
            password: hashedPassword,
        });

        // If user creation fails (rare edge case)
        if (!user) {
            res.status(500).json({
                success: false,
                message: "User not created due to an unknown issue",
            });
            return;
        }

        // Successful response
        res.status(201).json({
            success: true,
            message: "User created successfully",
            user,
        });
    } catch (error) {
        // Error handling
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : error,
        });
    }
};

export default registerUser;
