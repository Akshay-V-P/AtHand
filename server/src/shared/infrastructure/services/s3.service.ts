import { GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { s3client } from "../../../config/s3"

export const createUploadUrl = async (fileName: string, fileType: string) => {
    const key = `provider/`
}

export const createDisplayUrl = async (key: string): Promise<string | null> => {
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
        })

        const url = await getSignedUrl(
            s3client,
            command,
            { expiresIn: 60 * 10 }
        )

        return url
}