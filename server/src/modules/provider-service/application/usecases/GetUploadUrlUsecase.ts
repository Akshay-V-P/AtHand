import { IImageUrlService, CreateUploadUrlResponse } from "../../domain/services/IImageUrlService";

export class GetUploadUrlUsecase {
    constructor(private readonly imageUrlService: IImageUrlService) { }

    async execute(fileName: string, fileType: string): Promise<CreateUploadUrlResponse> {
        return await this.imageUrlService.createUploadUrl(fileName, fileType);
    }
}
