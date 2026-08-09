import express from "express"
import cors from "cors"

import { authRoute } from "./modules/auth/container"
import cookieParser from "cookie-parser"
import { errorHandler } from "./shared/middleware/ErrorMiddleware"
import { provAppRoutes } from "./modules/providerApplication/container"
import { categoryRoutes } from "./modules/category/container"


const app = express()

app.disable('x-powered-by')

app.use(cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials:true
}))


app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRoute)
app.use('/api/provider-application', provAppRoutes)
app.use('/api/category', categoryRoutes)

app.use(errorHandler)

export default app
