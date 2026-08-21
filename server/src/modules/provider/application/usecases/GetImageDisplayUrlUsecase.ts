import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { IImageUrlService } from "../../domain/services/IImageUrlService";

export class GetImageDisplayUrlUsecase implements IUsecase<string, string | null>{
    constructor(
        private readonly urlService:IImageUrlService,
    ) { }
    
    async execute(data: string): Promise<string | null> {
        const url = await this.urlService.createDisplayUrl(data)
        if (!url) return null
        return url
    }
}