import { ProviderStatus } from "../../../provider/domain/enums/ProviderStatus";

export interface UpdateProviderStatusDTO{
    id:string
    status:ProviderStatus
}