import express from "express"
import cors from "cors"

import { authRoute } from "./modules/auth/container"

const app = express()

app.use(cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials:true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRoute)

export default app
