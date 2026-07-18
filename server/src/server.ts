import './config/env'
import app from "./app"
import { connectDB } from "./config/database"
import { connectRedis } from "./config/redis"

const PORT = process.env.PORT || 5000

async function startServer() {
    try {

        await connectDB()
        await connectRedis()

        app.listen(PORT, ()=> console.log("Server listening to port: ", PORT))
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

startServer()