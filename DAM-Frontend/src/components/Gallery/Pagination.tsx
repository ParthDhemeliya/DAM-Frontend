import React from 'react'
import type {
  Pagination as PaginationType,
  AssetFilters,
} from '../../interfaces'

interface PaginationProps {
  displayPagination: PaginationType | null
  filters: AssetFilters
  onLimitChange: (limit: number) => void
  onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({
  displayPagination,
  filters,
  onLimitChange,
  onPageChange,
}) => {
  if (!displayPagination || displayPagination.totalPages <= 1) {
    return null
  }

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value)
    onLimitChange(newLimit)
  }

  const handlePageChange = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= displayPagination.totalPages) {
      onPageChange(pageNum)
    }
  }

  const renderPageNumbers = () => {
    const pages = []
    const currentPage = displayPagination.currentPage
    const totalPages = displayPagination.totalPages

    // Show current page and 1-2 pages on each side
    let startPage = Math.max(1, currentPage - 1)
    let endPage = Math.min(totalPages, currentPage + 1)

    // Adjust if we're near the edges
    if (currentPage <= 2) {
      startPage = 1
      endPage = Math.min(totalPages, 3)
    } else if (currentPage >= totalPages - 1) {
      startPage = Math.max(1, totalPages - 2)
      endPage = totalPages
    }

    // Show ellipsis before if needed
    if (startPage > 1) {
      pages.push(
        <button
          key="prev-ellipsis"
          disabled
          className="px-2 py-2 text-sm font-medium text-gray-400 bg-white border border-gray-300 cursor-default"
        >
          ...
        </button>
      )
    }

    // Show page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm font-medium border transition-colors ${
            i === currentPage
              ? 'text-blue-600 bg-blue-50 border-blue-500'
              : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50 hover:text-gray-700'
          }`}
        >
          {i}
        </button>
      )
    }

    // Show ellipsis after if needed
    if (endPage < totalPages) {
      pages.push(
        <button
          key="next-ellipsis"
          disabled
          className="px-2 py-2 text-sm font-medium text-gray-400 bg-white border border-gray-300 cursor-default"
        >
          ...
        </button>
      )
    }

    return pages
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      {/* Items per page selector - Left side */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700">Show:</span>
        <select
          value={filters.limit || 20}
          onChange={handleLimitChange}
          className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span className="text-sm text-gray-700">per page</span>
      </div>

      {/* Page navigation - Center */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => handlePageChange(displayPagination.currentPage - 1)}
          disabled={displayPagination.currentPage <= 1}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {renderPageNumbers()}

        <button
          onClick={() => handlePageChange(displayPagination.currentPage + 1)}
          disabled={
            displayPagination.currentPage >= displayPagination.totalPages
          }
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      {/* Page info - Right side */}
      <div className="text-sm text-gray-600">
        Page {displayPagination.currentPage} of {displayPagination.totalPages}
      </div>
    </div>
  )
}

export default Pagination
