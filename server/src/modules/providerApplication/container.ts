import { s3client } from "../../config/s3"
import { validate } from "../../shared/middleware/ValidationMiddleware"
import { CreateFileUploadUrlUsecase } from "./application/usecases/CreateFileUploadUrlUsecase"
import { CreateProviderUsecase } from "./application/usecases/CreateProviderUsercase"
import { GetImageDisplayUrlUsecase } from "../provider/application/usecases/GetImageDisplayUrlUsecase"
import { GetProvierDraftDetailsUsecase } from "./application/usecases/GetProviderDraftDetailsUsecase"
import { GetProviderUsecase } from "../provider/application/usecases/GetProviderUsecase"
import { UpdateProviderUsecase } from "../provider/application/usecases/UpdateProviderUsecase"
import { UploadBusinessDetailsDraftUsecase } from "./application/usecases/UploadBusinessDetailsUsecase"
import { UploadDocumentUsecase } from "./application/usecases/UploadDocumentUsecase"
import { ProviderDocumentRepository } from "../provider/infrastructure/database/repositories/ProviderDocumentRepository"
import { ProviderDraftRepository } from "../provider/infrastructure/database/repositories/ProviderDraftRepository"
import { ProviderRepository } from "../provider/infrastructure/database/repositories/ProviderRepository"
import { S3UploadUrlService } from "../provider/infrastructure/services/S3UrlService"
import { CreateProviderController } from "./presentation/controllers/createProvider/CreateProviderController"
import { UploadDocumentController } from "./presentation/controllers/documentControllers/UploadDocumentController"
import { GetProviderDraftController } from "./presentation/controllers/draftControllers/GetProviderDraftController"
import { UploadDraftController } from "./presentation/controllers/draftControllers/UploadDraftController"
import { CreateFileUploadUrlController } from "./presentation/controllers/fileUpload/CreateFileUploadUrlController"
import { GetProviderController } from "./presentation/controllers/getProvider/GetProviderController"
import { GetDisplayImageUrlController } from "./presentation/controllers/imageUrlController/GetDisplayImageUrlController"
import { UpdateProviderController } from "./presentation/controllers/updateProvider/UpdateProviderController"
import { createProviderApplicationRoute } from "./presentation/routes/providerApplication.routes"
import { createProviderSchema } from "./presentation/validators/createProvider.schema"
import { uploadDocumentSchema } from "./presentation/validators/uploadDocument.schema"
import { updateProviderDraftSchema } from "./presentation/validators/uploadProviderDraft.schema"

const providerRepository = new ProviderRepository()
const documentRepository = new ProviderDocumentRepository()
const providerDraftRepository = new ProviderDraftRepository()

const s3UploadUrlService = new S3UploadUrlService(s3client)


const createProviderUsecase = new CreateProviderUsecase(providerRepository, providerDraftRepository)
const uploadDocumentUsecase = new UploadDocumentUsecase(documentRepository, providerRepository)
const uploadBusinessDetailsUsecase = new UploadBusinessDetailsDraftUsecase(providerDraftRepository, providerRepository, documentRepository)
const createUploadUrlUsecase = new CreateFileUploadUrlUsecase(s3UploadUrlService)
const getProviderDraftUsecase = new GetProvierDraftDetailsUsecase(providerRepository, providerDraftRepository)
const getProviderUsecase = new GetProviderUsecase(providerRepository)
const getDisplayImageUrlUsecase = new GetImageDisplayUrlUsecase(s3UploadUrlService)
const updateProviderUsecase = new UpdateProviderUsecase(providerRepository)


const createProviderController = new CreateProviderController(createProviderUsecase)
const uploadDocumentController = new UploadDocumentController(uploadDocumentUsecase)
const uploadDraftController = new UploadDraftController(uploadBusinessDetailsUsecase)
const createUploadUrlController = new CreateFileUploadUrlController(createUploadUrlUsecase)
const getProviderDraftController = new GetProviderDraftController(getProviderDraftUsecase)
const getProviderController = new GetProviderController(getProviderUsecase)
const getDisplayImageUrlController = new GetDisplayImageUrlController(getDisplayImageUrlUsecase)
const updateProviderController = new UpdateProviderController(updateProviderUsecase)

const provAppControllers = {
    createProviderController,
    uploadDocumentController,
    uploadDraftController,
    createUploadUrlController,
    getProviderDraftController,
    getProviderController,
    getDisplayImageUrlController,
    updateProviderController,
}

const providerMiddlewares = {
    validateuploadDocument: validate(uploadDocumentSchema),
    validateCreateProvider: validate(createProviderSchema),
    validateUploadProviderDraft: validate(updateProviderDraftSchema)
}

export type ProvAppController = typeof provAppControllers
export type ProvAppMiddlewares = typeof providerMiddlewares

export const provAppRoutes = createProviderApplicationRoute(provAppControllers, providerMiddlewares)