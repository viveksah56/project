export interface IPaginationQuery {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}
export interface IPaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}
export interface IPaginatedResult<T> {
    data: T[];
    meta: IPaginationMeta;
}
export interface IPaginationParams {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: 1 | -1;
}
export declare const getPaginationParams: (query: IPaginationQuery) => IPaginationParams;
export declare const buildPaginationMeta: (total: number, page: number, limit: number) => IPaginationMeta;
//# sourceMappingURL=pagination.d.ts.map