import mongoose from "mongoose";

async function dbConnection() {
    const dbURI = process.env.CONNECT_URI;
    if (!dbURI) {
        console.error("Error: Missing CONNECT_URI in environment variables.");
        return;
    }

    try {
        await mongoose.connect(dbURI);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection error:", error);
    }
}

export default dbConnection;
