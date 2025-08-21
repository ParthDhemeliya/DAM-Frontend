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

  return (
    <div className="mt-6 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-700">
          Show{' '}
          <select
            value={filters.limit || 20}
            onChange={(e) => onLimitChange(parseInt(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>{' '}
          per page
        </span>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => {
            if (displayPagination.hasPrev) {
              onPageChange(displayPagination.page - 1)
            }
          }}
          disabled={!displayPagination.hasPrev}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        <div className="flex items-center space-x-1">
          {Array.from(
            { length: Math.min(5, displayPagination.totalPages) },
            (_, i) => {
              let pageNum
              if (displayPagination.totalPages <= 5) {
                pageNum = i + 1
              } else if (displayPagination.page <= 3) {
                pageNum = i + 1
              } else if (
                displayPagination.page >=
                displayPagination.totalPages - 2
              ) {
                pageNum = displayPagination.totalPages - 4 + i
              } else {
                pageNum = displayPagination.page - 2 + i
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    pageNum === displayPagination.page
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              )
            }
          )}
        </div>

        <button
          onClick={() => {
            if (displayPagination.hasNext) {
              onPageChange(displayPagination.page + 1)
            }
          }}
          disabled={!displayPagination.hasNext}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:border-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Pagination
