// Production configuration
export const PRODUCTION_CONFIG = {
  API_BASE_URL: '/api', // Relative path for production
  BACKEND_URL: '', // Empty for same-origin requests
  ENABLE_LOGGING: false,
  ENABLE_DEBUG: false,
  ENABLE_SOURCE_MAPS: false,
  ENABLE_HOT_RELOAD: false,
  ENABLE_ANALYTICS: true,
  ENABLE_ERROR_TRACKING: true,
  ENABLE_PERFORMANCE_MONITORING: true,
  CACHE_STRATEGY: 'aggressive',
  COMPRESSION_LEVEL: 'high',
  BUNDLE_ANALYSIS: false,
}

// Environment detection
export const isProduction = () => {
  return import.meta.env.PROD || process.env.NODE_ENV === 'production'
}

export const isDevelopment = () => {
  return import.meta.env.DEV || process.env.NODE_ENV === 'development'
}

export const getConfig = () => {
  return isProduction() ? PRODUCTION_CONFIG : {
    ...PRODUCTION_CONFIG,
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    ENABLE_LOGGING: true,
    ENABLE_DEBUG: true,
    ENABLE_SOURCE_MAPS: true,
    ENABLE_HOT_RELOAD: true,
    CACHE_STRATEGY: 'development',
    COMPRESSION_LEVEL: 'low',
  }
}
