import { GetDocumentsUsecase } from "../provider/application/usecases/GetDocumentsUsecase";
import { GetProviderUsecase } from "../provider/application/usecases/GetProviderUsecase";
import { UpdateDocumentUsecase } from "../provider/application/usecases/UpdateDocumentUsecase";
import { UpdateProviderUsecase } from "../provider/application/usecases/UpdateProviderUsecase";
import { ProviderDocumentRepository } from "../provider/infrastructure/database/repositories/ProviderDocumentRepository";
import { ProviderDraftRepository } from "../provider/infrastructure/database/repositories/ProviderDraftRepository";
import { ProviderRepository } from "../provider/infrastructure/database/repositories/ProviderRepository";
import { FetchProvidersUsecase } from "./application/usecases/FetchProvidersUsecase";
import { UpdateProviderStatusUsecase } from "./application/usecases/UpdateProviderStatusUsecase";
import { GetDoucmentsController } from "./presentation/controllers/documentsControllers/GetDocumentsController";
import { UpdateDocumentController } from "./presentation/controllers/documentsControllers/UpdateDocumentController";
import { UpdateProviderStatusController } from "./presentation/controllers/documentsControllers/UpdateProviderStatusController";
import { FetchProvidersController } from "./presentation/controllers/ProviderControllers/FetchProvidersController";
import { GetProviderController } from "./presentation/controllers/ProviderControllers/GetProviderController";
import { UpdateProviderController } from "./presentation/controllers/ProviderControllers/UpdateProviderController";
import { createAdminProviderManageRoutes } from "./presentation/routes/adminProvManage.routes";

const providerRepository = new ProviderRepository()
const documentRepository = new ProviderDocumentRepository()
const providerDraftRepository = new ProviderDraftRepository()

const fetchProvidersUsecase = new FetchProvidersUsecase(providerRepository)
const getProviderUsecase = new GetProviderUsecase(providerRepository)
const getDocumentsUsecase = new GetDocumentsUsecase(documentRepository)
const updateDocumentUsecase = new UpdateDocumentUsecase(documentRepository, providerRepository, providerDraftRepository)
const updateProviderStatusUsecase = new UpdateProviderStatusUsecase(providerRepository, documentRepository)
const updateProviderUsecase = new UpdateProviderUsecase(providerRepository)

const fetchProvidersController = new FetchProvidersController(fetchProvidersUsecase)
const getProviderController = new GetProviderController(getProviderUsecase)
const getDocumentsController = new GetDoucmentsController(getDocumentsUsecase)
const updateDocumentController = new UpdateDocumentController(updateDocumentUsecase)
const updateProviderStatusController = new UpdateProviderStatusController(updateProviderStatusUsecase)
const updateProviderController = new UpdateProviderController(updateProviderUsecase)

const controllers = {
    fetchProvidersController,
    getProviderController,
    getDocumentsController,
    updateDocumentController,
    updateProviderStatusController,
    updateProviderController,
}

export type AdminProvMangeControllerType = typeof controllers

export const adminProvManageRoutes = createAdminProviderManageRoutes(controllers)
