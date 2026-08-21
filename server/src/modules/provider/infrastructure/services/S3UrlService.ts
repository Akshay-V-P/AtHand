import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { CreateUploadUrlResponse, IImageUrlService } from "../../domain/services/IImageUrlService";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class S3UploadUrlService implements IImageUrlService{
    constructor(
        private readonly client: S3Client,
    ) { }
    
    async createUploadUrl(fileName: string, fileType: string): Promise<CreateUploadUrlResponse> {
        const key = `provider/documents/${crypto.randomUUID()}-${fileName}`
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            ContentType:fileType,
        })

        const uploadUrl = await getSignedUrl(
            this.client,
            command,
            {
                expiresIn:300,
            },
        )

        return {
            uploadUrl,
            key
        }
    }

    async createDisplayUrl(key: string): Promise<string | null>{
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
        })

        const url = await getSignedUrl(
            this.client,
            command,
            {
                expiresIn:60*10
            }
        )

        return url
    }
}