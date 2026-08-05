import { CreateProviderUsecase } from "./application/usecases/CreateProviderUsercase"
import { UploadDocumentUsecase } from "./application/usecases/UploadDocumentUsecase"
import { ProviderDocumentRepository } from "./infrastructure/database/repositories/ProviderDocumentRepository"
import { ProviderRepository } from "./infrastructure/database/repositories/ProviderRepository"
import { CreateProviderController } from "./presentation/controllers/createProvider/CreateProviderController"
import { UploadDocumentController } from "./presentation/controllers/documentControllers/UploadDocumentController"
import { createProviderApplicationRoute } from "./presentation/routes/providerApplication.routes"

const providerRepository = new ProviderRepository()
const documentRepository = new ProviderDocumentRepository()


const createProviderUsecase = new CreateProviderUsecase(providerRepository)
const uploadDocumentUsecase = new UploadDocumentUsecase(documentRepository, providerRepository)


const createProviderController = new CreateProviderController(createProviderUsecase)
const uploadDocumentController = new UploadDocumentController(uploadDocumentUsecase)

const provAppControllers = {
    createProviderController,
    uploadDocumentController,
}

export type ProvAppController = typeof provAppControllers

export const provAppRoutes = createProviderApplicationRoute(provAppControllers)