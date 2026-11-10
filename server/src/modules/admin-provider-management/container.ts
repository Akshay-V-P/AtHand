import { CategoryRepository } from "../category/infrastructure/database/repositories/CategroryRepository";
import { ProviderServiceRepository } from "../provider-service/infrastructure/database/repositories/ProviderServiceRepository";
import { GetDocumentsUsecase } from "../provider/application/usecases/GetDocumentsUsecase";
import { GetProviderUsecase } from "../provider/application/usecases/GetProviderUsecase";
import { UpdateDocumentUsecase } from "../provider/application/usecases/UpdateDocumentUsecase";
import { UpdateProviderUsecase } from "../provider/application/usecases/UpdateProviderUsecase";
import { ProviderDocumentRepository } from "../provider/infrastructure/database/repositories/ProviderDocumentRepository";
import { ProviderDraftRepository } from "../provider/infrastructure/database/repositories/ProviderDraftRepository";
import { ProviderRepository } from "../provider/infrastructure/database/repositories/ProviderRepository";
import { AdminUpdateProviderServiceUsecase } from "./application/usecases/AdminUpdateProviderServiceUsecase";
import { BlockProviderServiceUsecase } from "./application/usecases/BlockProviderServiceUsecase";
import { FetchProvidersUsecase } from "./application/usecases/FetchProvidersUsecase";
import { GetAdminProviderServicesUsecase } from "./application/usecases/GetAdminProviderServicesUsecase";
import { UnblockProviderServiceUsecase } from "./application/usecases/UnblockProviderServiceUsecase";
import { UpdateProviderStatusUsecase } from "./application/usecases/UpdateProviderStatusUsecase";
import { GetDoucmentsController } from "./presentation/controllers/documentsControllers/GetDocumentsController";
import { UpdateDocumentController } from "./presentation/controllers/documentsControllers/UpdateDocumentController";
import { UpdateProviderStatusController } from "./presentation/controllers/documentsControllers/UpdateProviderStatusController";
import { FetchProvidersController } from "./presentation/controllers/ProviderControllers/FetchProvidersController";
import { GetProviderController } from "./presentation/controllers/ProviderControllers/GetProviderController";
import { UpdateProviderController } from "./presentation/controllers/ProviderControllers/UpdateProviderController";
import { BlockProviderServiceController } from "./presentation/controllers/serviceControllers/BlockProviderServiceController";
import { GetProviderServicesController } from "./presentation/controllers/serviceControllers/GetProviderServicesController";
import { UnblockProviderServiceController } from "./presentation/controllers/serviceControllers/UnblockProviderServiceController";
import { UpdateProviderServiceController } from "./presentation/controllers/serviceControllers/UpdateProviderServiceController";
import { createAdminProviderManageRoutes } from "./presentation/routes/adminProvManage.routes";

const providerRepository = new ProviderRepository();
const documentRepository = new ProviderDocumentRepository();
const providerDraftRepository = new ProviderDraftRepository();
const providerServiceRepository = new ProviderServiceRepository();
const categoryRepository = new CategoryRepository();

const fetchProvidersUsecase = new FetchProvidersUsecase(providerRepository);
const getProviderUsecase = new GetProviderUsecase(providerRepository);
const getDocumentsUsecase = new GetDocumentsUsecase(documentRepository);
const updateDocumentUsecase = new UpdateDocumentUsecase(documentRepository, providerRepository, providerDraftRepository);
const updateProviderStatusUsecase = new UpdateProviderStatusUsecase(providerRepository, documentRepository);
const updateProviderUsecase = new UpdateProviderUsecase(providerRepository);

const getAdminProviderServicesUsecase = new GetAdminProviderServicesUsecase(
    providerRepository,
    providerServiceRepository
);
const adminUpdateProviderServiceUsecase = new AdminUpdateProviderServiceUsecase(
    providerServiceRepository,
    categoryRepository
);
const blockProviderServiceUsecase = new BlockProviderServiceUsecase(providerServiceRepository);
const unblockProviderServiceUsecase = new UnblockProviderServiceUsecase(providerServiceRepository);

const fetchProvidersController = new FetchProvidersController(fetchProvidersUsecase);
const getProviderController = new GetProviderController(getProviderUsecase);
const getDocumentsController = new GetDoucmentsController(getDocumentsUsecase);
const updateDocumentController = new UpdateDocumentController(updateDocumentUsecase);
const updateProviderStatusController = new UpdateProviderStatusController(updateProviderStatusUsecase);
const updateProviderController = new UpdateProviderController(updateProviderUsecase);

const getProviderServicesController = new GetProviderServicesController(getAdminProviderServicesUsecase);
const updateProviderServiceController = new UpdateProviderServiceController(adminUpdateProviderServiceUsecase);
const blockProviderServiceController = new BlockProviderServiceController(blockProviderServiceUsecase);
const unblockProviderServiceController = new UnblockProviderServiceController(unblockProviderServiceUsecase);

const controllers = {
    fetchProvidersController,
    getProviderController,
    getDocumentsController,
    updateDocumentController,
    updateProviderStatusController,
    updateProviderController,
    getProviderServicesController,
    updateProviderServiceController,
    blockProviderServiceController,
    unblockProviderServiceController,
};

export type AdminProvMangeControllerType = typeof controllers;

export const adminProvManageRoutes = createAdminProviderManageRoutes(controllers);
