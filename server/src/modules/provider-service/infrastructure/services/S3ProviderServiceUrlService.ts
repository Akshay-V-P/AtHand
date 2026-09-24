import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { CreateUploadUrlResponse, IImageUrlService } from "../../domain/services/IImageUrlService"

export class S3ProviderServiceUrlService implements IImageUrlService {
    constructor(
        private readonly client: S3Client,
    ) { }

    async createUploadUrl(fileName: string, fileType: string): Promise<CreateUploadUrlResponse> {
        const key = `provider/service/${crypto.randomUUID()}-${fileName.split(" ").join("-")}`

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            ContentType: fileType,
        })

        const uploadUrl = await getSignedUrl(
            this.client,
            command,
            { expiresIn: 300 }, // 5 minutes
        )

        return { uploadUrl, key }
    }
}
