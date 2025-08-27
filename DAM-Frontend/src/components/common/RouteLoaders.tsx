import LoadingSpinner from './LoadingSpinner'

// Loading components for each route
export const DashboardLoader = () => (
  <LoadingSpinner size="xl" text="Loading Dashboard..." fullScreen />
)

export const GalleryLoader = () => (
  <LoadingSpinner size="xl" text="Loading Asset Gallery..." fullScreen />
)



export const AnalyticsLoader = () => (
  <LoadingSpinner size="xl" text="Loading Analytics..." fullScreen />
)
