import { validate } from "../../shared/middleware/ValidationMiddleware"
import { CreateProviderUsecase } from "./application/usecases/CreateProviderUsercase"
import { UploadBusinessDetailsDraftUsecase } from "./application/usecases/UploadBusinessDetailsUsecase"
import { UploadDocumentUsecase } from "./application/usecases/UploadDocumentUsecase"
import { ProviderDocumentRepository } from "./infrastructure/database/repositories/ProviderDocumentRepository"
import { ProviderDraftRepository } from "./infrastructure/database/repositories/ProviderDraftRepository"
import { ProviderRepository } from "./infrastructure/database/repositories/ProviderRepository"
import { CreateProviderController } from "./presentation/controllers/createProvider/CreateProviderController"
import { UploadDocumentController } from "./presentation/controllers/documentControllers/UploadDocumentController"
import { UploadDraftController } from "./presentation/controllers/draftControllers/UploadDraftController"
import { createProviderApplicationRoute } from "./presentation/routes/providerApplication.routes"
import { createProviderSchema } from "./presentation/validators/createProvider.schema"
import { uploadDocumentSchema } from "./presentation/validators/uploadDocument.schema"

const providerRepository = new ProviderRepository()
const documentRepository = new ProviderDocumentRepository()
const providerDraftRepository = new ProviderDraftRepository()


const createProviderUsecase = new CreateProviderUsecase(providerRepository)
const uploadDocumentUsecase = new UploadDocumentUsecase(documentRepository, providerRepository)
const uploadBusinessDetailsUsecase = new UploadBusinessDetailsDraftUsecase(providerDraftRepository)


const createProviderController = new CreateProviderController(createProviderUsecase)
const uploadDocumentController = new UploadDocumentController(uploadDocumentUsecase)
const uploadDraftController = new UploadDraftController(uploadBusinessDetailsUsecase)

const provAppControllers = {
    createProviderController,
    uploadDocumentController,
    uploadDraftController
}

const providerMiddlewares = {
    validateuploadDocument: validate(uploadDocumentSchema),
    validateCreateProvider: validate(createProviderSchema)
}

export type ProvAppController = typeof provAppControllers
export type ProvAppMiddlewares = typeof providerMiddlewares

export const provAppRoutes = createProviderApplicationRoute(provAppControllers, providerMiddlewares)