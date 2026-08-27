import express from "express"
import cors from "cors"

import { authRoute } from "./modules/auth/container"
import cookieParser from "cookie-parser"
import { errorHandler } from "./shared/middleware/ErrorMiddleware"
import { provAppRoutes } from "./modules/providerApplication/container"
import { adminProvManageRoutes } from "./modules/admin-provider-management/container"
import { categoryAdminRoutes } from "./modules/admin-category-management/container"


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
app.use('/api/admin', adminProvManageRoutes)
app.use('/api/admin', categoryAdminRoutes)

app.use(errorHandler)

export default app
