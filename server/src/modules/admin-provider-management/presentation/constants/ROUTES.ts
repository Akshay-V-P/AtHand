export const ROUTES = {
    GET_PROVIDERS: "/get-providers",
    PROVIDER: "/provider/:id",
    GET_DOCUMENTS: "/document",
    GET_DOCUMENT: "/document/:id",
    UPDATE_PROVIDER_STATUS: "/provider/:id/status",
    PROVIDER_SERVICES: "/provider/:id/services",
    PROVIDER_SERVICE_BY_ID: "/provider-service/:id",
    BLOCK_PROVIDER_SERVICE: "/provider-service/:id/block",
    UNBLOCK_PROVIDER_SERVICE: "/provider-service/:id/unblock",
} as const;
