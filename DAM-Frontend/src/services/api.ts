/* eslint-disable @typescript-eslint/no-explicit-any */

// API base URL for backend communication
const API_BASE_URL = 'http://localhost:5000/api'

// Timeout utility for fetch requests
const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeout = 30000
) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout - the server took too long to respond')
    }
    throw error
  }
}

// Retry utility for failed requests
const fetchWithRetry = async (
  url: string,
  options: RequestInit = {},
  timeout = 30000,
  maxRetries = 2
) => {
  let lastError: Error

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        // Wait before retrying (exponential backoff)
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        )
      }

      return await fetchWithTimeout(url, options, timeout)
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error')

      if (attempt === maxRetries) {
        throw lastError
      }

      // Only retry on timeout or network errors, not on HTTP errors
      if (
        lastError.message.includes('timeout') ||
        lastError.message.includes('Failed to fetch')
      ) {
        continue
      } else {
        throw lastError
      }
    }
  }

  throw lastError!
}

// Upload file function
export const uploadFile = async (
  file: File,
  metadata?: {
    category?: string
    description?: string
    tags?: string
    author?: string
    department?: string
    project?: string
    duplicateAction?: 'skip' | 'replace' | 'error'
    replaceAssetId?: number
  }
): Promise<any> => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    // Add metadata if provided
    if (metadata) {
      Object.entries(metadata).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          formData.append(key, value.toString())
        }
      })
    }

    const response = await fetchWithTimeout(`${API_BASE_URL}/assets/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      )
    }

    return response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to upload file')
  }
}

// Upload multiple files function
export const uploadMultipleFiles = async (
  files: File[],
  metadata?: {
    category?: string
    description?: string
    tags?: string
    author?: string
    department?: string
    project?: string
    duplicateAction?: 'skip' | 'replace' | 'error'
    replaceAssetId?: number
  }
): Promise<any> => {
  try {
    const formData = new FormData()

    // Add all files
    files.forEach((file) => {
      formData.append('file', file)
    })

    // Add metadata if provided
    if (metadata) {
      Object.entries(metadata).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          formData.append(key, value.toString())
        }
      })
    }

    const response = await fetchWithTimeout(`${API_BASE_URL}/assets/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      )
    }

    return response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to upload files')
  }
}

export const getAssets = async (
  page: number = 1,
  limit: number = 20,
  filters?: any
): Promise<any> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        // Skip page and limit as they're already set above
        if (key === 'page' || key === 'limit') return

        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v))
          } else {
            params.append(key, value.toString())
          }
        }
      })
    }

    const response = await fetchWithRetry(
      `${API_BASE_URL}/assets?${params}`,
      {},
      60000
    ) // 60 second timeout for assets

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      )
    }

    return response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to fetch assets')
  }
}

export const searchAssets = async (
  query: string,
  page: number = 1,
  limit: number = 20,
  filters?: any
): Promise<any> => {
  try {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
    })

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        // Skip page and limit as they're already set above
        if (key === 'page' || key === 'limit') return

        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v))
          } else {
            params.append(key, value.toString())
          }
        }
      })
    }

    const response = await fetchWithTimeout(
      `${API_BASE_URL}/assets/search?${params}`
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      )
    }

    return response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to search assets')
  }
}

export const getAssetById = async (id: string): Promise<any> => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/assets/${id}`)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      )
    }

    return response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to fetch asset')
  }
}

export const deleteAsset = async (id: number): Promise<any> => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/assets/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      )
    }

    return response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to delete asset')
  }
}

export const downloadAsset = async (id: number, filename?: string) => {
  const url = `${API_BASE_URL}/assets/${id}/download`
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename || ''
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
}

export const streamAsset = (id: number) => `${API_BASE_URL}/assets/${id}/stream`

export const getDashboardStats = async () => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/stats`)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.error || `HTTP ${response.status}: ${response.statusText}`
    )
  }

  return response.json()
}

export const getUploadStats = async (period: string = 'month') => {
  const response = await fetchWithTimeout(
    `${API_BASE_URL}/stats/uploads?period=${period}`
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.error || `HTTP ${response.status}: ${response.statusText}`
    )
  }

  return response.json()
}

export const getDownloadStats = async (period: string = 'month') => {
  const response = await fetchWithTimeout(
    `${API_BASE_URL}/stats/downloads?period=${period}`
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.error || `HTTP ${response.status}: ${response.statusText}`
    )
  }

  return response.json()
}

export const getLatestAssets = async (limit: number = 10) => {
  const response = await fetchWithTimeout(
    `${API_BASE_URL}/stats/latest?limit=${limit}`
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.error || `HTTP ${response.status}: ${response.statusText}`
    )
  }

  return response.json()
}

export const getPopularAssets = async (limit: number = 10) => {
  const response = await fetchWithTimeout(
    `${API_BASE_URL}/stats/popular?limit=${limit}`
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.error || `HTTP ${response.status}: ${response.statusText}`
    )
  }

  return response.json()
}

export const getRealTimeStats = async () => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/stats/realtime`)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.error || `HTTP ${response.status}: ${response.statusText}`
    )
  }

  return response.json()
}

export const trackAssetView = async (
  assetId: number,
  userId?: string,
  metadata?: any
) => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/stats/track-view`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ assetId, userId, metadata }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.error || `HTTP ${response.status}: ${response.statusText}`
    )
  }

  return response.json()
}

export const trackAssetDownload = async (
  assetId: number,
  userId?: string,
  metadata?: any
) => {
  const response = await fetchWithTimeout(
    `${API_BASE_URL}/stats/track-download`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ assetId, userId, metadata }),
    }
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.error || `HTTP ${response.status}: ${response.statusText}`
    )
  }

  return response.json()
}

export const getAssetAnalytics = async (assetId: number) => {
  const response = await fetchWithTimeout(
    `${API_BASE_URL}/stats/asset/${assetId}/analytics`
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.error || `HTTP ${response.status}: ${response.statusText}`
    )
  }

  return response.json()
}

export const getUserBehaviorAnalytics = async (userId: string) => {
  const response = await fetchWithTimeout(
    `${API_BASE_URL}/stats/user/${userId}/behavior`
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.error || `HTTP ${response.status}: ${response.statusText}`
    )
  }

  return response.json()
}

// Jobs API functions
export const getJobs = async (
  page: number = 1,
  limit: number = 20
): Promise<any> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })

    const response = await fetchWithTimeout(`${API_BASE_URL}/jobs?${params}`)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      )
    }

    return response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to fetch jobs')
  }
}

export const getJobById = async (id: string): Promise<any> => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/jobs/${id}`)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      )
    }

    return response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to fetch job')
  }
}

export const createJob = async (jobData: any): Promise<any> => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      )
    }

    return response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to create job')
  }
}

// Queues API functions
export const getQueueStats = async (): Promise<any> => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/queues/stats`)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      )
    }

    return response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to fetch queue stats')
  }
}

export const addProcessingJob = async (jobData: {
  jobType: string
  assetId: number
  priority?: number
  options?: any
  delay?: number
}): Promise<any> => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/queues/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      )
    }

    return response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to add processing job')
  }
}

// Health check function
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetchWithTimeout('http://localhost:5000/health', {
      method: 'GET',
      signal: AbortSignal.timeout(5000), // 5 second timeout
    })
    return response.ok
  } catch (error) {
    console.error('Backend health check failed:', error)
    return false
  }
}
