import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { getAssets, searchAssets } from '../../services/api'
import type {
  Asset,
  Pagination,
  AssetFilters,
  SearchFilters,
} from '../../interfaces'

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
  async (filters: AssetFilters, { rejectWithValue }) => {
    try {
      const response = await getAssets(filters.page, filters.limit, filters)
      return response
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch assets'
      )
    }
  }
)

// Async thunk for searching assets
export const searchAssetsAsync = createAsyncThunk(
  'assets/searchAssets',
  async (searchFilters: SearchFilters, { rejectWithValue }) => {
    try {
      const response = await searchAssets(
        searchFilters.query,
        searchFilters.page,
        searchFilters.limit,
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
      state.filters = { ...state.filters, ...action.payload }
      // Reset to first page when filters change
      if (action.payload.page === undefined) {
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
      state.filters.page = 1 // Reset to first page when changing limit
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.filters.sortBy = action.payload
    },
    setSortOrder: (state, action: PayloadAction<string>) => {
      state.filters.sortOrder = action.payload
    },
    setFileType: (state, action: PayloadAction<string>) => {
      state.filters.fileType = action.payload
      state.filters.page = 1
    },
    setDateRange: (
      state,
      action: PayloadAction<{ dateFrom?: string; dateTo?: string }>
    ) => {
      state.filters.dateFrom = action.payload.dateFrom
      state.filters.dateTo = action.payload.dateTo
      state.filters.page = 1
    },
    setTags: (state, action: PayloadAction<string[]>) => {
      state.filters.tags = action.payload
      state.filters.page = 1
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.filters.category = action.payload
      state.filters.page = 1
    },
    setStatus: (state, action: PayloadAction<string>) => {
      state.filters.status = action.payload
      state.filters.page = 1
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
        state.pagination = action.payload.pagination
        state.error = null
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
        state.searchPagination = action.payload.pagination
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
  clearError,
} = assetSlice.actions

export default assetSlice.reducer
