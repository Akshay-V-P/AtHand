export interface CreateUploadUrlResponse {
    uploadUrl: string;
    key: string;
}

export interface IImageUrlService {
    createUploadUrl(fileName: string, fileType: string): Promise<CreateUploadUrlResponse>;
}
