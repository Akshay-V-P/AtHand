import { uploadFileToS3 } from "../../../../services/imageService"

export const uploadDocumentToS3 = async (file: File) => {
    return uploadFileToS3(file,"/provider-application/presigned-url")
}