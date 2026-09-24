import { ProviderServiceRepository } from "./infrastructure/database/repositories/ProviderServiceRepository";
import { CreateProviderServiceUsecase } from "./application/usecases/CreateProviderServiceUsecase";
import { GetProviderServiceUsecase } from "./application/usecases/GetProviderServiceUsecase";
import { GetProviderServicesUsecase } from "./application/usecases/GetProviderServicesUsecase";
import { UpdateProviderServiceUsecase } from "./application/usecases/UpdateProviderServiceUsecase";
import { CreateProviderServiceController } from "./presentation/controllers/CreateProviderServiceController";
import { GetProviderServiceController } from "./presentation/controllers/GetProviderServiceController";
import { GetProviderServicesController } from "./presentation/controllers/GetProviderServicesController";
import { UpdateProviderServiceController } from "./presentation/controllers/UpdateProviderServiceController";
import { GetUploadUrlController } from "./presentation/controllers/GetUploadUrlController";
import { GetNearbyServicesController } from "./presentation/controllers/GetNearbyServicesController";
import { createProviderServiceRoutes } from "./presentation/routes/provider-service.routes";
import { S3ProviderServiceUrlService } from "./infrastructure/services/S3ProviderServiceUrlService";
import { GetUploadUrlUsecase } from "./application/usecases/GetUploadUrlUsecase";
import { GetNearbyServicesUsecase } from "./application/usecases/GetNearbyServicesUsecase";
import { s3client } from "../../config/s3";

const providerServiceRepository = new ProviderServiceRepository();
const s3ProviderServiceUrlService = new S3ProviderServiceUrlService(s3client);

const createProviderServiceUsecase = new CreateProviderServiceUsecase(providerServiceRepository);
const getProviderServiceUsecase = new GetProviderServiceUsecase(providerServiceRepository);
const getProviderServicesUsecase = new GetProviderServicesUsecase(providerServiceRepository);
const updateProviderServiceUsecase = new UpdateProviderServiceUsecase(providerServiceRepository);
const getUploadUrlUsecase = new GetUploadUrlUsecase(s3ProviderServiceUrlService);
const getNearbyServicesUsecase = new GetNearbyServicesUsecase(providerServiceRepository);

const createController = new CreateProviderServiceController(createProviderServiceUsecase);
const getByIdController = new GetProviderServiceController(getProviderServiceUsecase);
const getAllController = new GetProviderServicesController(getProviderServicesUsecase);
const updateController = new UpdateProviderServiceController(updateProviderServiceUsecase);
const getUploadUrlController = new GetUploadUrlController(getUploadUrlUsecase);
const getNearbyServicesController = new GetNearbyServicesController(getNearbyServicesUsecase);

const providerServiceControllers = {
    createController,
    getByIdController,
    getAllController,
    updateController,
    getUploadUrlController,
    getNearbyServicesController
};

export type ProviderServiceControllerType = typeof providerServiceControllers;
export const providerServiceRoutes = createProviderServiceRoutes(providerServiceControllers);
