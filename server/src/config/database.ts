import mongoose from "mongoose";

export async function connectDB() {
    const conn = await mongoose.connect(process.env.MONGO_URL, {})
    console.log(`MongoDB connected ${conn.connection.host}`)
}