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
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
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

export interface UploadSummary {
  uploaded: number
  replaced: number
  skipped: number
}

export interface AssetData {
  id: string
  filename: string
  original_name: string
  file_path: string
  file_size: number
  mime_type: string
  category: string
  created_at: string
  updated_at: string
}

export interface UploadResponse {
  success: boolean
  data: AssetData | AssetData[]
  message: string
  summary: UploadSummary
  count?: number
}
