export interface CreateUploadUrlResponse{
    uploadUrl: string;
    key: string;
}

export interface IUploadUrlService{
    createUploadUrl(fileName: string, fileType: string): Promise<CreateUploadUrlResponse>;
}