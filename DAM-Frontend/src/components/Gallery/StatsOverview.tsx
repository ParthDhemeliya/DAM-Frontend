import React, { useEffect, useState } from 'react'
import {
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  EyeIcon,
} from '@heroicons/react/24/outline'
import { getDashboardStats } from '../../services/api'
import type { DashboardStats } from '../../interfaces'

interface StatsOverviewProps {
  onLatestAssetsClick?: () => void
}

const StatsOverview: React.FC<StatsOverviewProps> = ({
  onLatestAssetsClick,
}) => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)

        // Fetch only dashboard stats
        const dashboardStats = await getDashboardStats()

        setStats(dashboardStats.data)
        setError(null)
      } catch (err) {
        console.error('Error fetching stats:', err)
        setError('Failed to load statistics')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()

    // Refresh stats every 30 seconds to keep them current
    const interval = setInterval(fetchStats, 30000)
    
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p className="text-red-800 text-sm">{error}</p>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="mb-6">
      {/* Stats Cards Row - Spread evenly across remaining space */}
      <div className="flex space-x-4 h-full">
        {/* Total Downloads */}
        <div className="bg-white py-3 px-4 rounded-lg border border-gray-200 shadow-sm flex-1 flex items-center justify-center min-h-[52px]">
          <div className="flex items-center">
            <ArrowDownTrayIcon className="h-5 w-5 text-green-600" />
            <span className="ml-2 text-sm font-medium text-gray-500">
              Total Downloads:
            </span>
            <span className="ml-2 text-lg font-bold text-gray-900">
              {(stats.totalDownloads || 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Total Uploads */}
        <div className="bg-white py-3 px-4 rounded-lg border border-gray-200 shadow-sm flex-1 flex items-center justify-center min-h-[52px]">
          <div className="flex items-center">
            <ArrowUpTrayIcon className="h-5 w-5 text-blue-600" />
            <span className="ml-2 text-sm font-medium text-gray-500">
              Total Uploads:
            </span>
            <span className="ml-2 text-lg font-bold text-gray-900">
              {(stats.totalUploads || 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Latest Assets Button */}
        <div className="bg-white py-3 px-4 rounded-lg border border-gray-200 shadow-sm flex-1 flex items-center justify-center min-h-[52px]">
          <button
            className="flex items-center text-purple-600 hover:text-purple-700 transition-colors"
            onClick={onLatestAssetsClick}
          >
            <EyeIcon className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Latest Assets</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default StatsOverview
