import React from 'react'
import type { Asset, Pagination } from '../../interfaces'

interface ResultsSummaryProps {
  displayAssets: Asset[]
  displayPagination: Pagination | null
  selectedType: string
  selectedDateRange: string
  searchTerm: string
}

const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  displayAssets,
  displayPagination,
  selectedType,
  selectedDateRange,
  searchTerm,
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <p className="text-sm text-gray-600">
          Showing <span className="font-medium">{displayAssets.length}</span> of{' '}
          <span className="font-medium">
            {displayPagination?.totalItems || 0}
          </span>{' '}
          assets
        </p>
        {displayPagination && displayPagination.totalItems > 0 && (
          <span className="text-sm text-gray-500">
            Page {displayPagination.currentPage} of{' '}
            {displayPagination.totalPages}
          </span>
        )}
      </div>

      {/* Active Filters Display */}
      {(selectedType !== 'all' ||
        selectedDateRange !== 'all' ||
        searchTerm) && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Active filters:</span>
          {selectedType !== 'all' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Type: {selectedType}
            </span>
          )}
          {selectedDateRange !== 'all' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Date: {selectedDateRange}
            </span>
          )}
          {searchTerm && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              Search: "{searchTerm}"
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default ResultsSummary
