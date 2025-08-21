import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../store/store'
import {
  fetchAssetsWithFilters,
  searchAssetsAsync,
  setFilters,
  clearFilters,
  clearSearch,
  setDateRange,
  setSortBy,
  setSortOrder,
} from '../store/slices/assetSlice'
import type { Asset, AssetFilters } from '../interfaces'
import {
  trackAssetDownload,
  trackAssetView,
  downloadAsset,
} from '../services/api'
import { toast } from 'react-toastify'
import {
  GalleryHeader,
  SearchBar,
  GalleryFilters,
  ResultsSummary,
  AssetsTable,
  PreviewModal,
  LoadingState,
  ErrorState,
  Pagination,
  StatsOverview,
} from '../components/Gallery'

export default function Gallery() {
  const dispatch = useDispatch<AppDispatch>()
  const {
    assets,
    filteredAssets,
    loading,
    error,
    pagination,
    filters,
    searchResults,
    searchPagination,
    searchLoading,
    searchError,
  } = useSelector((state: RootState) => state.assets)

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedDateRange, setSelectedDateRange] = useState<string>('all')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null)
  const initialLoadRef = useRef(false)

  // Enhanced file type categorization with better MIME type handling
  const getFileTypeCategory = useCallback((mimeType: string) => {
    const type = mimeType.toLowerCase()

    if (type.startsWith('image/')) return 'image'
    if (type.startsWith('video/')) return 'video'
    if (type.startsWith('audio/')) return 'audio'
    if (
      type.includes('pdf') ||
      type.includes('document') ||
      type.includes('word') ||
      type.includes('excel') ||
      type.includes('powerpoint') ||
      type.includes('text/')
    )
      return 'document'
    if (
      type.includes('zip') ||
      type.includes('rar') ||
      type.includes('7z') ||
      type.includes('tar') ||
      type.includes('gz')
    )
      return 'archive'
    if (
      type.includes('font') ||
      type.includes('ttf') ||
      type.includes('otf') ||
      type.includes('woff')
    )
      return 'font'
    return 'other'
  }, [])

  // Memoized file type categories for better performance
  const fileTypeCategories = useMemo(() => {
    const categories = Array.from(
      new Set(assets.map((asset) => getFileTypeCategory(asset.mime_type)))
    )
    return categories.sort()
  }, [assets, getFileTypeCategory])

  // Fetch assets on component mount
  useEffect(() => {
    if (!initialLoadRef.current) {
      dispatch(fetchAssetsWithFilters(filters))
      initialLoadRef.current = true
    }
  }, [dispatch, filters])

  // Enhanced search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim().length >= 2) {
        const searchFilters = {
          query: searchTerm,
          page: 1,
          limit: filters.limit || 20,
          fileType: filters.fileType,
          status: filters.status,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
        }
        dispatch(searchAssetsAsync(searchFilters))
      } else if (searchTerm.trim().length === 0) {
        dispatch(clearSearch())
        dispatch(fetchAssetsWithFilters(filters))
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(timeoutId)
  }, [searchTerm, dispatch, filters])

  // Memoized filter change handler
  const handleFilterChange = useCallback(
    (newFilters: Partial<AssetFilters>) => {
      const updatedFilters = { ...filters, ...newFilters, page: 1 }
      dispatch(setFilters(updatedFilters))
      dispatch(fetchAssetsWithFilters(updatedFilters))
    },
    [dispatch, filters]
  )

  const handleTypeChange = useCallback(
    (type: string) => {
      setSelectedType(type)
      const fileType = type === 'all' ? undefined : type
      handleFilterChange({ fileType })
    },
    [handleFilterChange]
  )

  const handleDateRangeChange = useCallback(
    (range: string) => {
      setSelectedDateRange(range)
      let dateFrom: string | undefined
      let dateTo: string | undefined

      if (range !== 'all') {
        const now = new Date()
        const dayMs = 24 * 60 * 60 * 1000

        switch (range) {
          case 'today':
            dateFrom = now.toISOString().split('T')[0]
            dateTo = now.toISOString().split('T')[0]
            break
          case 'week': {
            const weekAgo = new Date(now.getTime() - 7 * dayMs)
            dateFrom = weekAgo.toISOString().split('T')[0]
            dateTo = now.toISOString().split('T')[0]
            break
          }
          case 'month': {
            const monthAgo = new Date(now.getTime() - 30 * dayMs)
            dateFrom = monthAgo.toISOString().split('T')[0]
            dateTo = now.toISOString().split('T')[0]
            break
          }
          case 'year': {
            const yearAgo = new Date(now.getTime() - 365 * dayMs)
            dateFrom = yearAgo.toISOString().split('T')[0]
            dateTo = now.toISOString().split('T')[0]
            break
          }
        }
      }

      dispatch(setDateRange({ dateFrom, dateTo }))
      handleFilterChange({ dateFrom, dateTo })
    },
    [dispatch, handleFilterChange]
  )

  const handleSortChange = useCallback(
    (sortBy: string) => {
      dispatch(setSortBy(sortBy))
      handleFilterChange({ sortBy })
    },
    [dispatch, handleFilterChange]
  )

  const handleSortOrderChange = useCallback(
    (sortOrder: string) => {
      dispatch(setSortOrder(sortOrder))
      handleFilterChange({ sortOrder })
    },
    [dispatch, handleFilterChange]
  )

  const clearAllFilters = useCallback(() => {
    setSelectedType('all')
    setSelectedDateRange('all')
    setSearchTerm('')

    const resetFilters = {
      page: 1,
      limit: 20,
      sortBy: 'created_at',
      sortOrder: 'DESC',
      fileType: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      status: undefined,
      category: undefined,
      author: undefined,
      department: undefined,
      project: undefined,
    }

    dispatch(clearFilters())
    dispatch(clearSearch())
    dispatch(fetchAssetsWithFilters(resetFilters))
  }, [dispatch])

  // Enhanced file size formatting
  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }, [])

  // Enhanced date formatting
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays} days ago`
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }, [])

  const openPreview = useCallback((asset: Asset) => {
    setPreviewAsset(asset)
    setPreviewOpen(true)
    trackAssetView(asset.id).catch((err) =>
      console.error('Failed to track asset view:', err)
    )
  }, [])

  const closePreview = useCallback(() => {
    setPreviewOpen(false)
    setPreviewAsset(null)
  }, [])

  const handleDownload = useCallback((asset: Asset) => {
    toast.success('Download successfully!')

    // Track download for analytics
    trackAssetDownload(asset.id).catch((err) =>
      console.error('Failed to track download:', err)
    )

    // Start the actual download
    downloadAsset(asset.id, asset.original_name)
  }, [])

  // Memoized display logic
  const displayAssets = useMemo(
    () => (searchTerm.trim().length >= 2 ? searchResults : filteredAssets),
    [searchTerm, searchResults, filteredAssets]
  )

  const displayPagination = useMemo(
    () => (searchTerm.trim().length >= 2 ? searchPagination : pagination),
    [searchTerm, searchPagination, pagination]
  )

  const isLoading = loading || searchLoading
  const hasError = error || searchError

  // Enhanced error display
  if (hasError) {
    return (
      <ErrorState
        error={hasError}
        onRetry={() => dispatch(fetchAssetsWithFilters(filters))}
      />
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto ">
      <GalleryHeader />

      {/* Search Bar and Total Downloads in the same row */}
      <div className="flex items-center space-x-4 mb-6">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <div className="flex-1">
          <StatsOverview
            onLatestAssetsClick={() => {
              // Fetch and display latest assets
              dispatch(
                fetchAssetsWithFilters({
                  ...filters,
                  sortBy: 'created_at',
                  sortOrder: 'DESC',
                  page: 1,
                })
              )
            }}
          />
        </div>
      </div>

      <GalleryFilters
        selectedType={selectedType}
        selectedDateRange={selectedDateRange}
        searchTerm={searchTerm}
        fileTypeCategories={fileTypeCategories}
        filters={filters}
        onTypeChange={handleTypeChange}
        onDateRangeChange={handleDateRangeChange}
        onSortChange={handleSortChange}
        onSortOrderChange={handleSortOrderChange}
        onClearAllFilters={clearAllFilters}
      />

      <ResultsSummary
        displayAssets={displayAssets}
        displayPagination={displayPagination}
        selectedType={selectedType}
        selectedDateRange={selectedDateRange}
        searchTerm={searchTerm}
      />

      {/* Loading State */}
      {isLoading && <LoadingState />}

      {/* Assets Table */}
      {!isLoading && (
        <AssetsTable
          displayAssets={displayAssets}
          displayPagination={displayPagination}
          getFileTypeCategory={getFileTypeCategory}
          formatFileSize={formatFileSize}
          formatDate={formatDate}
          onPreview={openPreview}
          onDownload={handleDownload}
        />
      )}

      {/* Pagination Controls */}
      <Pagination
        displayPagination={displayPagination}
        filters={filters}
        onLimitChange={(newLimit) => {
          const updatedFilters = {
            ...filters,
            limit: newLimit,
            page: 1,
          }
          dispatch(setFilters(updatedFilters))
          dispatch(fetchAssetsWithFilters(updatedFilters))
        }}
        onPageChange={(newPage) => {
          const updatedFilters = { ...filters, page: newPage }
          dispatch(setFilters(updatedFilters))
          dispatch(fetchAssetsWithFilters(updatedFilters))
        }}
      />

      {/* Preview Modal */}
      <PreviewModal
        previewOpen={previewOpen}
        previewAsset={previewAsset}
        onClose={closePreview}
        onDownload={handleDownload}
        formatFileSize={formatFileSize}
        formatDate={formatDate}
      />
    </div>
  )
}
