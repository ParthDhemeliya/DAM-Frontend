import React, { useState, useEffect } from 'react'
import {
  getDashboardStats,
  getUploadStats,
  getDownloadStats,
  getLatestAssets,
  getPopularAssets,
  getRealTimeStats,
} from '../services/api'
import type {
  DashboardStats,
  UploadStats,
  DownloadStats,
  LatestAsset,
  PopularAsset,
  RealTimeStats,
} from '../interfaces'
import LoadingSpinner from '../components/common/LoadingSpinner'

const Analytics: React.FC = () => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  )
  const [uploadStats, setUploadStats] = useState<UploadStats | null>(null)
  const [downloadStats, setDownloadStats] = useState<DownloadStats | null>(null)
  const [latestAssets, setLatestAssets] = useState<LatestAsset[]>([])
  const [popularAssets, setPopularAssets] = useState<PopularAsset[]>([])
  const [realTimeStats, setRealTimeStats] = useState<RealTimeStats | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<
    'day' | 'week' | 'month' | 'year'
  >('month')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalyticsData()
    const interval = setInterval(fetchRealTimeStats, 30000)
    return () => clearInterval(interval)
  }, [selectedPeriod])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [
        dashboardData,
        uploadData,
        downloadData,
        latestData,
        popularData,
        realTimeData,
      ] = await Promise.all([
        getDashboardStats(),
        getUploadStats(selectedPeriod),
        getDownloadStats(selectedPeriod),
        getLatestAssets(10),
        getPopularAssets(10),
        getRealTimeStats(),
      ])

      setDashboardStats(dashboardData.data)
      setUploadStats(uploadData.data)
      setDownloadStats(downloadData.data)
      setLatestAssets(latestData.data)
      setPopularAssets(popularData.data)
      setRealTimeStats(realTimeData.data)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch analytics data'
      )
    } finally {
      setLoading(false)
    }
  }

  const fetchRealTimeStats = async () => {
    try {
      const realTimeData = await getRealTimeStats()
      setRealTimeStats(realTimeData.data)
    } catch (err) {
      console.log(err)
    }
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const getPopularityColor = (score: number): string => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Analytics
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAnalyticsData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Analytics Dashboard
                </h1>
                <p className="mt-2 text-gray-600">
                  Real-time insights from Redis analytics
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedPeriod}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(e) => setSelectedPeriod(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="day">Last 24 Hours</option>
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="year">Last Year</option>
                </select>
                <button
                  onClick={fetchAnalyticsData}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Assets
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {dashboardStats?.totalAssets
                    ? formatNumber(dashboardStats.totalAssets)
                    : '0'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Downloads
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {dashboardStats?.totalDownloads
                    ? formatNumber(dashboardStats.totalDownloads)
                    : '0'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Views</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {dashboardStats?.totalViews
                    ? formatNumber(dashboardStats.totalViews)
                    : '0'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Storage Used
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {dashboardStats?.totalStorage || '0 B'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Upload Statistics
            </h3>
            {uploadStats && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {uploadStats.uploadsToday}
                    </p>
                    <p className="text-sm text-gray-600">Today</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {uploadStats.uploadsThisWeek}
                    </p>
                    <p className="text-sm text-gray-600">This Week</p>
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {uploadStats.uploadsThisMonth}
                  </p>
                  <p className="text-sm text-gray-600">This Month</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-lg font-semibold text-gray-900">
                    {uploadStats.averageFileSize}
                  </p>
                  <p className="text-sm text-gray-600">Average File Size</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Download Statistics
            </h3>
            {downloadStats && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {downloadStats.downloadsToday}
                    </p>
                    <p className="text-sm text-gray-600">Today</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {downloadStats.downloadsThisWeek}
                    </p>
                    <p className="text-sm text-gray-600">This Week</p>
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {downloadStats.downloadsThisMonth}
                  </p>
                  <p className="text-sm text-gray-600">This Month</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-lg font-semibold text-gray-900">
                    {downloadStats.totalDownloads}
                  </p>
                  <p className="text-sm text-gray-600">Total Downloads</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {dashboardStats?.fileTypeBreakdown && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              File Type Distribution
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(dashboardStats.fileTypeBreakdown).map(
                ([type, count]) => (
                  <div
                    key={type}
                    className="text-center p-4 bg-gray-50 rounded-lg"
                  >
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                    <p className="text-sm text-gray-600 capitalize">{type}</p>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Most Popular Assets
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asset
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Downloads
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Popularity Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Downloaded
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {popularAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {asset.filename}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {asset.file_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {asset.totalDownloads}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-sm font-semibold ${getPopularityColor(
                          asset.popularityScore
                        )}`}
                      >
                        {asset.popularityScore}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(asset.lastDownloaded).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recently Added Assets
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asset
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Added
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {latestAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {asset.filename}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {asset.file_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {asset.file_size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {asset.status || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(asset.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {realTimeStats && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Real-time Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {realTimeStats.totalViews}
                </p>
                <p className="text-sm text-gray-600">Total Views</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {realTimeStats.totalDownloads}
                </p>
                <p className="text-sm text-gray-600">Total Downloads</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {realTimeStats.totalUploads}
                </p>
                <p className="text-sm text-gray-600">Total Uploads</p>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-gray-500">
              Last updated: {new Date(realTimeStats.timestamp).toLocaleString()}
            </div>
          </div>
        )}

        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Redis Analytics System
          </h3>
          <p className="text-blue-800 text-sm">
            This dashboard displays real-time analytics data from Redis,
            including asset views, downloads, popular assets, and user behavior
            patterns. Data is automatically tracked when users view or download
            assets and updates every 30 seconds.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Analytics
