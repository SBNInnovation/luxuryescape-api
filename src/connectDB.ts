import mongoose from "mongoose";

async function dbConnection() {
    const dbURI = process.env.CONNECT_URI;

    if (!dbURI) {
        console.error("Error: Missing CONNECT_URI in environment variables.");
        process.exit(1); // Exit the process to ensure the app doesn't run without a DB connection
    }

    try {
        await mongoose.connect(dbURI, {
            //useNewUrlParser: true,       // Ensure use of the new URL parser
           // useUnifiedTopology: true,   // Use the new Server Discovery and Monitoring engine
        });
        console.log("✅ Database connected successfully");
    } catch (error) {
        console.error("❌ Database connection error:", error);
    }
}

export default dbConnection;
