export * from './analytics.interface'

export interface Asset {
  id: number
  filename: string
  original_name: string
  file_type: string
  mime_type: string
  file_size: number
  storage_path: string
  storage_bucket: string
  status: string
  metadata: {
    tags?: string[]
    category?: string
    author?: string
    department?: string
    project?: string
    description?: string
  }
  created_at: string
  updated_at: string
  processed_at?: string
  signedUrl?: string
}

export interface Pagination {
  currentPage: number
  limit: number
  totalItems: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// Backend pagination format (what the API actually returns)
export interface BackendPagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// Helper function to convert backend pagination to frontend format
export const mapBackendPagination = (
  backendPagination: BackendPagination
): Pagination => {
  return {
    currentPage: backendPagination.page,
    limit: backendPagination.limit,
    totalItems: backendPagination.total,
    totalPages: backendPagination.totalPages,
    hasNext: backendPagination.hasNext,
    hasPrev: backendPagination.hasPrev,
  }
}

export interface AssetFilters {
  page?: number
  limit?: number
  fileType?: string
  status?: string
  dateFrom?: string
  dateTo?: string
  tags?: string[]
  category?: string
  author?: string
  department?: string
  project?: string
  sortBy?: string
  sortOrder?: string
}

export interface SearchFilters {
  query: string
  page?: number
  limit?: number
  fileType?: string
  status?: string
  sortBy?: string
  sortOrder?: string
}
