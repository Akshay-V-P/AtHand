export interface GetUsersDTO {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    isVerified?: string;
    sort?: string;
    sortOrder?: 'asc' | 'desc';
}