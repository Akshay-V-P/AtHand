import './config/env'
import app from "./app"
import { connectDB } from "./config/database"
import { connectRedis } from "./config/redis"
import { createServer } from 'http'
import { createRealtimeInfrastructure } from './shared/infrastructure/services/realtime'
import { initalizeNotificationModule } from './modules/notification/container'

const PORT = process.env.PORT || 5000

async function startServer() {
    try {

        await connectDB()
        await connectRedis()

        const httpServer = createServer(app)

        const realtime = createRealtimeInfrastructure(httpServer)

        initalizeNotificationModule(realtime.gateway)

        httpServer.listen(PORT, ()=> console.log("Server listening to port: ", PORT))
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

startServer()