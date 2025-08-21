export interface DashboardStats {
  totalAssets: number
  totalDownloads: number
  totalUploads: number
  totalViews: number
  totalStorage: string
  fileTypeBreakdown: { [key: string]: number }
  recentActivity: {
    uploads: number
    downloads: number
    views: number
  }
  realTimeStats: {
    totalViews: number
    totalDownloads: number
    totalUploads: number
    timestamp: string
  }
}

export interface UploadStats {
  totalUploads: number
  uploadsToday: number
  uploadsThisWeek: number
  uploadsThisMonth: number
  averageFileSize: string
  fileTypeBreakdown: { [key: string]: number }
}

export interface DownloadStats {
  totalDownloads: number
  downloadsToday: number
  downloadsThisWeek: number
  downloadsThisMonth: number
  popularAssets: {
    id: number
    filename: string
    file_type: string
    totalDownloads: number
    lastDownloaded: string
    popularityScore: number
  }[]
}

export interface AssetUsageAnalytics {
  assetId: number
  filename: string
  fileType: string
  totalViews: number
  totalDownloads: number
  totalAccesses: number
  lastViewed: string
  lastDownloaded: string
  viewsToday: number
  downloadsToday: number
  viewsThisWeek: number
  downloadsThisWeek: number
  viewsThisMonth: number
  downloadsThisMonth: number
  accessFrequency: 'high' | 'medium' | 'low'
  popularityScore: number
}

export interface UserBehaviorAnalytics {
  userId: string
  totalAssetsAccessed: number
  totalViews: number
  totalDownloads: number
  lastActivity: string
  favoriteFileTypes: string[]
  activityPattern: {
    morning: number
    afternoon: number
    evening: number
    night: number
  }
  userSegment: 'power' | 'regular' | 'casual'
}

export interface RealTimeStats {
  totalViews: number
  totalDownloads: number
  totalUploads: number
  timestamp: string
}

export interface PopularAsset {
  id: number
  filename: string
  file_type: string
  totalDownloads: number
  lastDownloaded: string
  popularityScore: number
}

export interface LatestAsset {
  id: number
  filename: string
  file_type: string
  file_size: string
  status: string
  created_at: string
  metadata: any
}

export interface PerformanceMetrics {
  assetId: number
  filename: string
  responseTime: number
  errorRate: number
  availability: number
  userSatisfaction: number
  loadTime: number
}
