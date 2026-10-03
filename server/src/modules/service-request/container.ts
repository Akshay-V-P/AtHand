import { ServiceRequestRepository } from "./infrastructure/database/repositories/ServiceRequestRepository";
import { CreateServiceRequestUseCase } from "./application/usecases/CreateServiceRequestUseCase";
import { UpdateServiceRequestUseCase } from "./application/usecases/UpdateServiceRequestUseCase";
import { CancelServiceRequestUseCase } from "./application/usecases/CancelServiceRequestUseCase";
import { GetServiceRequestUseCase } from "./application/usecases/GetServiceRequestUseCase";
import { GetUserServiceRequestsUseCase } from "./application/usecases/GetUserServiceRequestsUseCase";

import { CreateServiceRequestController } from "./presentation/controllers/CreateServiceRequestController";
import { UpdateServiceRequestController } from "./presentation/controllers/UpdateServiceRequestController";
import { CancelServiceRequestController } from "./presentation/controllers/CancelServiceRequestController";
import { GetServiceRequestController } from "./presentation/controllers/GetServiceRequestController";
import { GetServiceRequestsController } from "./presentation/controllers/GetServiceRequestsController";

import { createServiceRequestRoutes } from "./presentation/routes/serviceRequestRoutes";

const serviceRequestRepository = new ServiceRequestRepository();

const createServiceRequestUseCase = new CreateServiceRequestUseCase(serviceRequestRepository);
const updateServiceRequestUseCase = new UpdateServiceRequestUseCase(serviceRequestRepository);
const cancelServiceRequestUseCase = new CancelServiceRequestUseCase(serviceRequestRepository);
const getServiceRequestUseCase = new GetServiceRequestUseCase(serviceRequestRepository);
const getUserServiceRequestsUseCase = new GetUserServiceRequestsUseCase(serviceRequestRepository);

const createController = new CreateServiceRequestController(createServiceRequestUseCase);
const updateController = new UpdateServiceRequestController(updateServiceRequestUseCase);
const cancelController = new CancelServiceRequestController(cancelServiceRequestUseCase);
const getServiceRequestController = new GetServiceRequestController(getServiceRequestUseCase);
const getServiceRequestsController = new GetServiceRequestsController(getUserServiceRequestsUseCase);

const serviceRequestControllers = {
    createController,
    updateController,
    cancelController,
    getServiceRequestController,
    getServiceRequestsController
};

export type ServiceRequestControllerType = typeof serviceRequestControllers;
export const serviceRequestRoutes = createServiceRequestRoutes(serviceRequestControllers);
