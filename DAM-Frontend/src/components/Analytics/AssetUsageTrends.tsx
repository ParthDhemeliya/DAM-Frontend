import React from 'react'

interface AssetUsageTrendsProps {
  uploadStats: any
  downloadStats: any
  period: string
}

const AssetUsageTrends: React.FC<AssetUsageTrendsProps> = ({
  uploadStats,
  downloadStats,
  period,
}) => {
  const getPeriodLabel = (period: string): string => {
    switch (period) {
      case 'day':
        return 'Last 24 Hours'
      case 'week':
        return 'Last Week'
      case 'month':
        return 'Last Month'
      case 'year':
        return 'Last Year'
      default:
        return 'Last Month'
    }
  }

  const getTrendIndicator = (current: number, previous: number) => {
    if (current > previous) {
      return (
        <span className="inline-flex items-center text-green-600">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
          +{(((current - previous) / previous) * 100).toFixed(1)}%
        </span>
      )
    } else if (current < previous) {
      return (
        <span className="inline-flex items-center text-red-600">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
            />
          </svg>
          -{(((previous - current) / previous) * 100).toFixed(1)}%
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center text-gray-600">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 12h14"
            />
          </svg>
          No change
        </span>
      )
    }
  }

  // Mock data for trends (in a real app, this would come from the backend)
  const mockTrends = {
    uploads: {
      current: uploadStats?.uploadsThisMonth || 0,
      previous: Math.floor((uploadStats?.uploadsThisMonth || 0) * 0.8),
    },
    downloads: {
      current: downloadStats?.downloadsThisMonth || 0,
      previous: Math.floor((downloadStats?.downloadsThisMonth || 0) * 0.9),
    },
    views: {
      current: Math.floor((downloadStats?.downloadsThisMonth || 0) * 2.5),
      previous: Math.floor((downloadStats?.downloadsThisMonth || 0) * 2.2),
    },
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Usage Trends - {getPeriodLabel(period)}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Uploads Trend */}
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 mb-2">
            {mockTrends.uploads.current}
          </div>
          <p className="text-sm text-gray-600 mb-2">Uploads</p>
          {getTrendIndicator(
            mockTrends.uploads.current,
            mockTrends.uploads.previous
          )}
        </div>

        {/* Downloads Trend */}
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600 mb-2">
            {mockTrends.downloads.current}
          </div>
          <p className="text-sm text-gray-600 mb-2">Downloads</p>
          {getTrendIndicator(
            mockTrends.downloads.current,
            mockTrends.downloads.previous
          )}
        </div>

        {/* Views Trend */}
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 mb-2">
            {mockTrends.views.current}
          </div>
          <p className="text-sm text-gray-600 mb-2">Views</p>
          {getTrendIndicator(
            mockTrends.views.current,
            mockTrends.views.previous
          )}
        </div>
      </div>

      {/* Usage Insights */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Insights</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>
            • Upload activity is{' '}
            {mockTrends.uploads.current > mockTrends.uploads.previous
              ? 'increasing'
              : 'decreasing'}{' '}
            compared to the previous period
          </li>
          <li>
            • Download patterns show{' '}
            {mockTrends.downloads.current > mockTrends.downloads.previous
              ? 'higher'
              : 'lower'}{' '}
            engagement
          </li>
          <li>
            • View-to-download ratio is approximately{' '}
            {Math.round(
              mockTrends.views.current / mockTrends.downloads.current
            )}
            :1
          </li>
        </ul>
      </div>
    </div>
  )
}

export default AssetUsageTrends
