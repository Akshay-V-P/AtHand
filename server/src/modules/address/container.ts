import { AddressRepository } from "./infrastructure/database/repositories/AddressRepository";
import { AddAddressUsecase } from "./application/usecases/AddAddressUsecase";
import { GetAddressesUsecase } from "./application/usecases/GetAddressesUsecase";
import { UpdateAddressUsecase } from "./application/usecases/UpdateAddressUsecase";
import { DeleteAddressUsecase } from "./application/usecases/DeleteAddressUsecase";
import { AddAddressController } from "./presentation/controllers/AddAddressController";
import { GetAddressesController } from "./presentation/controllers/GetAddressesController";
import { UpdateAddressController } from "./presentation/controllers/UpdateAddressController";
import { DeleteAddressController } from "./presentation/controllers/DeleteAddressController";
import { createAddressRoutes } from "./presentation/routes/address.routes";
import { authMiddleware } from "../auth/container";

const addressRepository = new AddressRepository();

const addAddressUsecase = new AddAddressUsecase(addressRepository);
const getAddressesUsecase = new GetAddressesUsecase(addressRepository);
const updateAddressUsecase = new UpdateAddressUsecase(addressRepository);
const deleteAddressUsecase = new DeleteAddressUsecase(addressRepository);

const addAddressController = new AddAddressController(addAddressUsecase);
const getAddressesController = new GetAddressesController(getAddressesUsecase);
const updateAddressController = new UpdateAddressController(updateAddressUsecase);
const deleteAddressController = new DeleteAddressController(deleteAddressUsecase);

const addressControllers = {
    addAddressController,
    getAddressesController,
    updateAddressController,
    deleteAddressController
}

export type AddressControllerType = typeof addressControllers;

export const addressRoutes = createAddressRoutes(addressControllers, authMiddleware);
