import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { CreateUploadUrlResponse, IUploadUrlService } from "../../domain/services/IUploadUrlService";
import { CreateFileUploadUrlDto } from "../dtos/CreateFileUploadUrlDto";

export class CreateFileUploadUrlUsecase implements IUsecase<CreateFileUploadUrlDto, CreateUploadUrlResponse>{

    constructor(
        private readonly uploadUrlService:IUploadUrlService,
    ){}

    async execute(data: CreateFileUploadUrlDto): Promise<CreateUploadUrlResponse> {

        const responseData = await this.uploadUrlService.createUploadUrl(data.fileName, data.fileType)

        if (!responseData) throw new NotFoundError("Unable to create url")
        return responseData
    }
}