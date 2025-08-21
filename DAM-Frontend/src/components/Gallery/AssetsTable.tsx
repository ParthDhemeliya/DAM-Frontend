import React from 'react'
import { EyeIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import type { Asset, Pagination } from '../../interfaces'

interface AssetsTableProps {
  displayAssets: Asset[]
  displayPagination: Pagination | null
  getFileTypeCategory: (mimeType: string) => string
  formatFileSize: (bytes: number) => string
  formatDate: (dateString: string) => string
  onPreview: (asset: Asset) => void
  onDownload: (asset: Asset) => void
}

const AssetsTable: React.FC<AssetsTableProps> = ({
  displayAssets,
  displayPagination,
  getFileTypeCategory,
  formatFileSize,
  formatDate,
  onPreview,
  onDownload,
}) => {
  if (displayAssets.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-sm font-medium text-gray-900 mb-1">
          No assets found
        </h3>
        <p className="text-sm text-gray-500">
          Try adjusting your filters or search terms
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                S.No
              </th>
              <th className="hidden md:table-cell px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                Filename
              </th>
              <th className="hidden sm:table-cell px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="hidden lg:table-cell px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th className="hidden lg:table-cell px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Preview
              </th>
              <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Download
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayAssets.map((asset, index) => (
              <tr
                key={asset.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-2 sm:px-4 lg:px-6 py-4 text-xs sm:text-sm font-medium text-gray-900">
                  {((displayPagination?.page || 1) - 1) *
                    (displayPagination?.limit || 20) +
                    index +
                    1}
                </td>
                <td className="hidden md:table-cell px-2 sm:px-4 lg:px-6 py-4 text-xs sm:text-sm text-gray-500">
                  {asset.id}
                </td>
                <td className="px-2 sm:px-4 lg:px-6 py-4">
                  <div className="text-xs sm:text-sm font-medium text-gray-900 break-words max-w-[180px] sm:max-w-[250px] lg:max-w-xs">
                    {asset.original_name}
                  </div>
                  {asset.metadata?.description &&
                    asset.metadata.description !== 'Uploaded via API' && (
                      <div className="text-xs text-gray-500 break-words max-w-[180px] sm:max-w-[250px] lg:max-w-xs mt-1">
                        {asset.metadata.description}
                      </div>
                    )}
                </td>
                <td className="hidden sm:table-cell px-2 sm:px-4 lg:px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      asset.mime_type.startsWith('image/')
                        ? 'bg-green-100 text-green-800'
                        : asset.mime_type.startsWith('video/')
                        ? 'bg-blue-100 text-blue-800'
                        : asset.mime_type.startsWith('audio/')
                        ? 'bg-purple-100 text-purple-800'
                        : asset.mime_type.includes('pdf') ||
                          asset.mime_type.includes('document') ||
                          asset.mime_type.includes('word') ||
                          asset.mime_type.includes('excel')
                        ? 'bg-red-100 text-red-800'
                        : asset.mime_type.includes('zip') ||
                          asset.mime_type.includes('rar') ||
                          asset.mime_type.includes('7z')
                        ? 'bg-yellow-100 text-yellow-800'
                        : asset.mime_type.includes('font') ||
                          asset.mime_type.includes('ttf')
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {getFileTypeCategory(asset.mime_type)
                      .charAt(0)
                      .toUpperCase() +
                      getFileTypeCategory(asset.mime_type).slice(1)}
                  </span>
                  <div className="text-xs text-gray-500 mt-1">
                    {asset.mime_type.split('/')[1]?.toUpperCase() || 'UNKNOWN'}
                  </div>
                </td>
                <td className="hidden lg:table-cell px-2 sm:px-4 lg:px-6 py-4 text-xs sm:text-sm text-gray-500">
                  {formatFileSize(asset.file_size)}
                </td>
                <td className="hidden lg:table-cell px-2 sm:px-4 lg:px-6 py-4 text-xs sm:text-sm text-gray-500">
                  {formatDate(asset.created_at)}
                </td>
                <td className="px-2 sm:px-4 lg:px-6 py-4 text-xs sm:text-sm text-gray-500">
                  <button
                    onClick={() => onPreview(asset)}
                    className="inline-flex items-center px-2 sm:px-3 py-1 border border-transparent text-xs sm:text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <EyeIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden sm:inline">Preview</span>
                    <span className="sm:hidden">View</span>
                  </button>
                </td>
                <td className="px-2 sm:px-4 lg:px-6 py-4 text-xs sm:text-sm text-gray-500">
                  <button
                    onClick={() => onDownload(asset)}
                    className="inline-flex items-center px-2 sm:px-3 py-1 border border-transparent text-xs sm:text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    <ArrowDownTrayIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden sm:inline">Download</span>
                    <span className="sm:hidden">DL</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AssetsTable
