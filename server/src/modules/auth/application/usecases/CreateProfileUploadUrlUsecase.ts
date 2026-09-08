import { IUsecase } from "../../../../shared/application/interfaces/IUsecase"
import { NotFoundError } from "../../../../shared/errors/NotFoundError"
import { CreateUploadUrlResponse, IImageUrlService } from "../../../provider/domain/services/IImageUrlService"

export interface CreateProfileUploadUrlDto {
    fileName: string;
    fileType: string;
}

export class CreateProfileUploadUrlUsecase implements IUsecase<CreateProfileUploadUrlDto, CreateUploadUrlResponse> {
    constructor(
        private readonly uploadUrlService: IImageUrlService,
    ) { }

    async execute(data: CreateProfileUploadUrlDto): Promise<CreateUploadUrlResponse> {
        const responseData = await this.uploadUrlService.createUploadUrl(data.fileName, data.fileType)
        if (!responseData) throw new NotFoundError("Unable to create url")
        return responseData
    }
}
