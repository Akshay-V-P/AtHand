import express from "express"
import cors from "cors"

import { authRoute } from "./modules/auth/container"
import cookieParser from "cookie-parser"
import { errorHandler } from "./shared/middleware/errorMiddleware"

const app = express()

app.use(cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials:true
}))


app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRoute)

app.use(errorHandler)

export default app
