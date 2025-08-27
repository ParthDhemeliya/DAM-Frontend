import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { getAssets, searchAssets } from '../../services/api'
import type {
  Asset,
  Pagination,
  AssetFilters,
  SearchFilters,
} from '../../interfaces'
import { mapBackendPagination } from '../../interfaces'

export interface AssetState {
  assets: Asset[]
  filteredAssets: Asset[]
  loading: boolean
  error: string | null
  pagination: Pagination | null
  filters: AssetFilters
  searchQuery: string
  searchResults: Asset[]
  searchPagination: Pagination | null
  searchLoading: boolean
  searchError: string | null
}

const initialState: AssetState = {
  assets: [],
  filteredAssets: [],
  loading: false,
  error: null,
  pagination: null,
  filters: {
    page: 1,
    limit: 20,
    sortBy: 'created_at',
    sortOrder: 'DESC',
  },
  searchQuery: '',
  searchResults: [],
  searchPagination: null,
  searchLoading: false,
  searchError: null,
}

// Async thunk for fetching assets with filters
export const fetchAssetsWithFilters = createAsyncThunk(
  'assets/fetchAssetsWithFilters',
  async (filters: AssetFilters) => {
    const response = await getAssets(
      filters.page || 1,
      filters.limit || 20,
      filters
    )
    return response
  }
)

// Async thunk for searching assets
export const searchAssetsAsync = createAsyncThunk(
  'assets/searchAssets',
  async (searchFilters: SearchFilters, { rejectWithValue }) => {
    try {
      const response = await searchAssets(
        searchFilters.query,
        searchFilters.page || 1,
        searchFilters.limit || 20,
        searchFilters
      )
      return response
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to search assets'
      )
    }
  }
)

const assetSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<AssetFilters>>) => {
      // Check if we're only changing the page (which should preserve other filters)
      const isOnlyPageChange =
        Object.keys(action.payload).length === 1 &&
        action.payload.page !== undefined

      state.filters = { ...state.filters, ...action.payload }

      // Only reset to first page when filters other than page change
      // But don't reset if we're explicitly setting a page number
      if (
        action.payload.page === undefined &&
        !isOnlyPageChange &&
        (action.payload.limit !== undefined ||
          action.payload.sortBy !== undefined ||
          action.payload.sortOrder !== undefined ||
          action.payload.fileType !== undefined ||
          action.payload.dateFrom !== undefined ||
          action.payload.dateTo !== undefined ||
          action.payload.tags !== undefined ||
          action.payload.category !== undefined ||
          action.payload.status !== undefined)
      ) {
        state.filters.page = 1
      }
    },
    clearFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 20,
        sortBy: 'created_at',
        sortOrder: 'DESC',
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    clearSearch: (state) => {
      state.searchQuery = ''
      state.searchResults = []
      state.searchPagination = null
      state.searchError = null
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.filters.limit = action.payload
      // Don't auto-reset page when changing limit
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.filters.sortBy = action.payload
    },
    setSortOrder: (state, action: PayloadAction<string>) => {
      state.filters.sortOrder = action.payload
    },
    setFileType: (state, action: PayloadAction<string>) => {
      state.filters.fileType = action.payload
      // Don't auto-reset page when changing file type
    },
    setDateRange: (
      state,
      action: PayloadAction<{ dateFrom?: string; dateTo?: string }>
    ) => {
      state.filters.dateFrom = action.payload.dateFrom
      state.filters.dateTo = action.payload.dateTo
      // Don't auto-reset page when changing date range
    },
    setTags: (state, action: PayloadAction<string[]>) => {
      state.filters.tags = action.payload
      // Don't auto-reset page when changing tags
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.filters.category = action.payload
      // Don't auto-reset page when changing category
    },
    setStatus: (state, action: PayloadAction<string>) => {
      state.filters.status = action.payload
      // Don't auto-reset page when changing status
    },
    refreshAssets: (state) => {
      // Force refresh by clearing current data
      state.assets = []
      state.filteredAssets = []
      state.pagination = null
      state.searchResults = []
      state.searchPagination = null
    },
    clearError: (state) => {
      state.error = null
      state.searchError = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch assets with filters
      .addCase(fetchAssetsWithFilters.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAssetsWithFilters.fulfilled, (state, action) => {
        state.loading = false
        state.assets = action.payload.data
        state.filteredAssets = action.payload.data
        state.pagination = mapBackendPagination(action.payload.pagination)
        state.error = null

        // Also clear search results when fetching new assets to ensure consistency
        if (state.searchResults.length > 0) {
          state.searchResults = []
          state.searchPagination = null
        }
      })
      .addCase(fetchAssetsWithFilters.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Search assets
      .addCase(searchAssetsAsync.pending, (state) => {
        state.searchLoading = true
        state.searchError = null
      })
      .addCase(searchAssetsAsync.fulfilled, (state, action) => {
        state.searchLoading = false
        state.searchResults = action.payload.data
        state.searchPagination = mapBackendPagination(action.payload.pagination)
        state.searchError = null
      })
      .addCase(searchAssetsAsync.rejected, (state, action) => {
        state.searchLoading = false
        state.searchError = action.payload as string
      })
  },
})

export const {
  setFilters,
  clearFilters,
  setSearchQuery,
  clearSearch,
  setPage,
  setLimit,
  setSortBy,
  setSortOrder,
  setFileType,
  setDateRange,
  setTags,
  setCategory,
  setStatus,
  refreshAssets,
  clearError,
} = assetSlice.actions

export default assetSlice.reducer
