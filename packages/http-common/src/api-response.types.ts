export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  nextCursor?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  message?: string;
  meta: {
    pagination: PaginationMeta;
    [key: string]: unknown;
  };
}

export interface ApiSuccessResponse<T = unknown> {
  statusCode: number;
  message?: string;
  data: T;
  meta: {
    timestamp: string;
    path: string;
    pagination?: PaginationMeta;
    [key: string]: unknown;
  };
}

export interface ApiErrorResponse {
  statusCode: number;
  error: string;
  message: string;
  path?: string;
  timestamp: string;
  /** Validation field errors — key = field name, value = array of messages */
  errors?: Record<string, string[]>;
}

