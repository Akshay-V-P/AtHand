import { Provider } from "../../../provider/domain/entities/Provider";

export interface FetProviderDTO{
    providers: Provider[];
    count:number
}