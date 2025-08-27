// Environment configuration
export const ENV_CONFIG = {
  // API Configuration
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',

  // Feature Flags
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS !== 'false',
  ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  ENABLE_LOGGING: import.meta.env.VITE_ENABLE_LOGGING !== 'false',

  // Performance Settings
  ENABLE_SERVICE_WORKER: import.meta.env.VITE_ENABLE_SERVICE_WORKER === 'true',
  ENABLE_PWA: import.meta.env.VITE_ENABLE_PWA === 'true',
  ENABLE_CACHE: import.meta.env.VITE_ENABLE_CACHE !== 'false',

  // Development Settings
  ENABLE_HOT_RELOAD: import.meta.env.DEV,
  ENABLE_SOURCE_MAPS: import.meta.env.DEV,

  // Production Settings
  ENABLE_COMPRESSION: import.meta.env.PROD,
  ENABLE_MINIFICATION: import.meta.env.PROD,
  ENABLE_TREE_SHAKING: import.meta.env.PROD,
}

// Environment detection
export const isProduction = () => import.meta.env.PROD
export const isDevelopment = () => import.meta.env.DEV
export const isTest = () => import.meta.env.MODE === 'test'

// Get configuration based on environment
export const getConfig = () => {
  if (isProduction()) {
    return {
      ...ENV_CONFIG,
      API_BASE_URL: '/api', // Relative path for production
      ENABLE_DEBUG: false,
      ENABLE_LOGGING: false,
      ENABLE_HOT_RELOAD: false,
      ENABLE_SOURCE_MAPS: false,
    }
  }

  return ENV_CONFIG
}

// Export default configuration
export default getConfig()
