// src/app/shared/models/paged-result.model.ts
export interface PagedResult<T> {
  data: T[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}