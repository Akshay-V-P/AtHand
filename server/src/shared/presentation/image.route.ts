import { Router } from "express"
import { getPresignedUrl } from "./imageController"

const createImageRoutes = ():Router => {
    const router = Router()

    router.post('/presigned-url', getPresignedUrl)

    return router
}

export const imageRoutes = createImageRoutes()