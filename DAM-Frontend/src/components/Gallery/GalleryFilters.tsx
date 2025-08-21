import React from 'react'
import {
  FunnelIcon,
  XMarkIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline'
import type { AssetFilters } from '../../interfaces'

interface GalleryFiltersProps {
  selectedType: string
  selectedDateRange: string
  searchTerm: string
  fileTypeCategories: string[]
  filters: AssetFilters
  onTypeChange: (type: string) => void
  onDateRangeChange: (range: string) => void
  onSortChange: (sortBy: string) => void
  onSortOrderChange: (sortOrder: string) => void
  onClearAllFilters: () => void
}

const GalleryFilters: React.FC<GalleryFiltersProps> = ({
  selectedType,
  selectedDateRange,
  searchTerm,
  fileTypeCategories,
  filters,
  onTypeChange,
  onDateRangeChange,
  onSortChange,
  onSortOrderChange,
  onClearAllFilters,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FunnelIcon className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        {(selectedType !== 'all' ||
          selectedDateRange !== 'all' ||
          searchTerm) && (
          <button
            onClick={onClearAllFilters}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
          >
            <XMarkIcon className="h-4 w-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Type Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            File Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <option value="all">All Types</option>
            {fileTypeCategories.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}s
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <CalendarIcon className="h-4 w-4 inline mr-2 text-blue-500" />
            Date Range
          </label>
          <select
            value={selectedDateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>

        {/* Sort Options */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Sort By
          </label>
          <div className="space-y-3">
            <select
              value={filters.sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <option value="created_at">Date Created</option>
              <option value="updated_at">Date Modified</option>
              <option value="filename">Name</option>
              <option value="file_size">Size</option>
              <option value="mime_type">Type</option>
            </select>
            <select
              value={filters.sortOrder}
              onChange={(e) => onSortOrderChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <option value="DESC">Descending</option>
              <option value="ASC">Ascending</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GalleryFilters
