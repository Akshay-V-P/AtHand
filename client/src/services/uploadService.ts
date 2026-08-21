import axios from "axios";
import { api } from "./axios";

interface PresignedUrlResponse{
    uploadUrl: string;
    key: string;
}

export const uploadFileToS3 = async (file: File, apiUrl: string) => {
    if(!apiUrl) throw new Error("Api url is required")
    const response = await api.post<{
        success: boolean;
        message: string;
        data: PresignedUrlResponse;
    }>(apiUrl, {
        fileName: file.name,
        fileType:file.type,
    })

    const { uploadUrl, key } = response.data.data
    
    await axios.put(uploadUrl, file, {
        headers: {
            "Content-Type":file.type,
        }
    })

    return key
}