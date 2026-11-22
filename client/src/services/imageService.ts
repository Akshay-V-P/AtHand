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

export const getPresignedDisplayUrl = async (key: string) => {
    if (!key) throw new Error("Image key not found")
    const url = await api.post("/image/presigned-url", { key })
    return url
}

// In-memory cache for presigned display URLs to avoid redundant network calls
const displayUrlCache = new Map<string, { url: string; expiresAt: number }>();

export const resolveDisplayUrl = async (keyOrUrl?: string | null): Promise<string> => {
    if (!keyOrUrl || typeof keyOrUrl !== 'string') return '';
    const trimmed = keyOrUrl.trim();
    if (!trimmed) return '';

    // Direct web / blob URLs do not need presigning
    if (
        trimmed.startsWith('http://') ||
        trimmed.startsWith('https://') ||
        trimmed.startsWith('blob:') ||
        trimmed.startsWith('data:')
    ) {
        return trimmed;
    }

    // Check memory cache (keep 9 minutes valid out of 10 minute s3 validity)
    const cached = displayUrlCache.get(trimmed);
    const now = Date.now();
    if (cached && cached.expiresAt > now) {
        return cached.url;
    }

    try {
        const response = await getPresignedDisplayUrl(trimmed);
        const url = response.data?.data;
        if (url && typeof url === 'string') {
            displayUrlCache.set(trimmed, {
                url,
                expiresAt: now + 9 * 60 * 1000 // 9 minutes
            });
            return url;
        }
        return '';
    } catch (error) {
        console.error('Failed to resolve presigned display URL for key:', trimmed, error);
        return '';
    }
};

export const resolveMultipleDisplayUrls = async (
    keysOrUrls?: (string | null | undefined)[]
): Promise<string[]> => {
    if (!keysOrUrls || !Array.isArray(keysOrUrls) || keysOrUrls.length === 0) return [];
    
    const validItems = keysOrUrls.filter((item): item is string => typeof item === 'string' && Boolean(item.trim()));
    if (validItems.length === 0) return [];

    const results = await Promise.allSettled(
        validItems.map(item => resolveDisplayUrl(item))
    );

    return results
        .filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled')
        .map(r => r.value)
        .filter(url => Boolean(url));
};